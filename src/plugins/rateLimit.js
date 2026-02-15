const rateLimitPlugin = require('@fastify/rate-limit');

async function rateLimitConfig(fastify) {
  await fastify.register(rateLimitPlugin, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
    redis: fastify.redis,  // We'll pass redis instance
    keyGenerator: (request) => request.ip
  });
}

module.exports = rateLimitConfig;