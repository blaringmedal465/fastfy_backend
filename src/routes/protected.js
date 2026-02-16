const { getAuth, clerkClient } = require('@clerk/fastify');

async function protectedRoutes(fastify) {
  // /me: Current user info (protected)
  fastify.get('/me', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    // Optional: Fetch full user from Clerk
    const user = await clerkClient.users.getUser(userId);

    return {
      userId,
      email: user.emailAddresses[0]?.emailAddress,
      username: user.username,
      user  // Full user object
    };
  });

  // Simple protected test
  fastify.get('/protected', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    return { message: 'Protected route — you are logged in!', userId };
  });
}

module.exports = protectedRoutes;