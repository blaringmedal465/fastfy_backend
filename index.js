require('dotenv').config();

const fastify = require('fastify')({ logger: true });

// Import modules
const prisma = require('./src/prisma/client');
const redis = require('./src/redis/client');
const rateLimitConfig = require('./src/plugins/rateLimit');
const routes = require('./src/routes/index');

// Decorate fastify with prisma & redis (accessible in all routes/plugins)
fastify.decorate('prisma', prisma);
fastify.decorate('redis', redis);

// Register plugins & routes
fastify.register(rateLimitConfig);
fastify.register(routes);

const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    await fastify.listen({ port: port, host: '0.0.0.0' });
    fastify.log.info(`Server running on port ${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();