require('dotenv').config();

const fastify = require('fastify')({ logger: true });

// Imports (add this)
const { clerkPlugin } = require('@clerk/fastify');

// Existing imports...
const prisma = require('./src/prisma/client');
const redis = require('./src/redis/client');
const rateLimitConfig = require('./src/plugins/rateLimit');
const routes = require('./src/routes/index');
const cors = require('@fastify/cors');
fastify.decorate('prisma', prisma);
fastify.decorate('redis', redis);

// Registers (add clerkPlugin here — order flexible)
fastify.register(rateLimitConfig);
fastify.register(clerkPlugin);  // Reads CLERK_SECRET_KEY from env automatically
fastify.register(routes);
fastify.register(cors, {
  origin: 'https://gcsewizard.bid',  // Frontend domain
  credentials: true,
});
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
