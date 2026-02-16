const { clerkPlugin } = require('@clerk/fastify');

async function clerkAuth(fastify) {
  await fastify.register(clerkPlugin);
}

module.exports = clerkAuth;