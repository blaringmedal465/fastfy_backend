const clerkAuth = require('../plugins/clerk');
const healthRoute = require('./health');
const testDbRoute = require('./testDb');
const testRedisRoute = require('./testRedis');
const limitedRoute = require('./limited');
const protectedRoutes = require('./protected');

async function routes(fastify) {
  fastify.register(clerkAuth);  // Global Clerk setup (production JWT verify)

  fastify.register(healthRoute);
  fastify.register(testDbRoute);
  fastify.register(testRedisRoute);
  fastify.register(limitedRoute);
  fastify.register(protectedRoutes);

  fastify.addHook('onClose', async () => {
    await fastify.prisma.$disconnect();
    fastify.redis.disconnect();
  });
}

module.exports = routes;