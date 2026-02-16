const healthRoute = require('./health');
const testDbRoute = require('./testDb');
const testRedisRoute = require('./testRedis');
const limitedRoute = require('./limited');
const protectedRoutes = require('./protected');  // Keep this
const debugRoutes = require('./debug');

async function routes(fastify) {
  fastify.register(healthRoute);
  fastify.register(testDbRoute);
  fastify.register(debugRoutes);
  fastify.register(testRedisRoute);
  fastify.register(limitedRoute);
  fastify.register(protectedRoutes);  // Protected routes (/me, /protected)

  // Cleanup on shutdown
  fastify.addHook('onClose', async () => {
    await fastify.prisma.$disconnect();
    fastify.redis.disconnect();
  });
}

module.exports = routes;