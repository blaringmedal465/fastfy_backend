const { getAuth, clerkClient } = require('@clerk/fastify');

async function protectedRoutes(fastify) {
  // Auto-sync Clerk user to DB + return info
  fastify.get('/me', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized: No valid Clerk session' });
    }

    // Fetch full Clerk user for email/username
    let clerkUser;
    try {
      clerkUser = await clerkClient.users.getUser(userId);
    } catch (error) {
      fastify.log.error(`Clerk user fetch failed: ${error.message}`);
      return reply.code(500).send({ error: 'Failed to fetch Clerk user data' });
    }

    const email = clerkUser.emailAddresses?.[0]?.emailAddress;
    const username = clerkUser.username;

    if (!email) {
      return reply.code(400).send({ error: 'Clerk user has no email' });
    }

    // Sync to your DB
    let user = await fastify.prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if (!user) {
      try {
        user = await fastify.prisma.user.create({
          data: {
            clerkId: userId,
            email,
            username: username || null,
          }
        });
        fastify.log.info(`Synced new Clerk user to DB: ${userId} (${email})`);
      } catch (error) {
        // Handle race (duplicate create)
        if (error.code === 'P2002') {
          user = await fastify.prisma.user.findUnique({ where: { clerkId: userId } });
        } else {
          fastify.log.error(`DB create error: ${error.message}`);
          return reply.code(500).send({ error: 'Failed to sync user to DB' });
        }
      }
    }

    return {
      dbUser: user,
      clerkEmail: email,
      clerkUsername: username,
      message: 'Authenticated and synced successfully!'
    };
  });

  // Simple protected test route
  fastify.get('/protected', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    return { message: 'Protected route — logged in!', clerkUserId: userId };
  });
}

module.exports = protectedRoutes;