async function testDbRoute(fastify) {
  fastify.post('/test-db', async (request, reply) => {
    const { email, name } = request.body || {};
    if (!email) {
      return reply.code(400).send({ error: 'Email required' });
    }
    try {
      const user = await fastify.prisma.user.create({
        data: { email, name: name || 'Test User' }
      });
      const allUsers = await fastify.prisma.user.findMany();
      return { created: user, allUsers };
    } catch (error) {
      return reply.code(500).send({ error: 'DB error', details: error.message });
    }
  });
}

module.exports = testDbRoute;