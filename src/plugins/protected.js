async function protectedRoutes(fastify) {
  // Auto-sync Clerk user to DB + return info
  fastify.get('/me', { preHandler: fastify.auth() }, async (request, reply) => {
    const { userId, sessionClaims } = request.auth;

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized: No userId' });
    }

    const email = sessionClaims?.email;
    const username = sessionClaims?.username;

    if (!email) {
      return reply.code(400).send({ error: 'Invalid auth claims: Missing email' });
    }

    // Find existing user by clerkId
    let user = await fastify.prisma.user.findUnique({
      where: { clerkId: userId }
    });

    // Create if not exists (first login/signup sync)
    if (!user) {
      try {
        user = await fastify.prisma.user.create({
          data: {
            clerkId: userId,
            email: email,
            username: username || null,  // Optional
          }
        });
        fastify.log.info(`Synced new Clerk user to DB: ${userId} (${email})`);
      } catch (error) {
        if (error.code === 'P2002') {  // Unique constraint fail (race condition)
          user = await fastify.prisma.user.findUnique({ where: { clerkId: userId } });
        } else {
          fastify.log.error(`DB sync error for ${userId}: ${error.message}`);
          return reply.code(500).send({ error: 'Failed to sync user' });
        }
      }
    }

    return {
      dbUser: {
        id: user.id,
        clerkId: user.clerkId,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt
      },
      message: 'Authenticated and synced!'
    };
  });

  // Simple protected test route
  fastify.get('/protected', { preHandler: fastify.auth() }, async (request) => {
    const { userId } = request.auth;
    return { message: 'This is protected — you are logged in!', yourClerkId: userId };
  });
}

module.exports = protectedRoutes;