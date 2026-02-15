const healthRoute = require('./health');
const testDbRoute = require('./testDb');
const testRedisRoute = require('./testRedis');
const limitedRoute = require('./limited');

async function routes(fastify) {
  fastify.register(healthRoute);
  fastify.register(testDbRoute);
  fastify.register(testRedisRoute);
  fastify.register(limitedRoute);

  // Cleanup on shutdown
  fastify.addHook('onClose', async () => {
    await fastify.prisma.$disconnect();
    fastify.redis.disconnect();
  });
}

module.exports = routes;