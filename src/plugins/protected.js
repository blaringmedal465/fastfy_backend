const { getAuth } = require('@clerk/fastify');

async function protectedRoutes(fastify) {
  // /me: Current user info (protected, production-ready)
  fastify.get('/me', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    return {
      userId,
      message: 'Authenticated user info from Clerk'
    };
  });

  // Simple protected test route
  fastify.get('/protected', async (request, reply) => {
    const { userId } = getAuth(request);

    if (!userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }

    return { message: 'This protected route works — logged in!', userId };
  });
}

module.exports = protectedRoutes;