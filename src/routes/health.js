async function healthRoute(fastify) {
  fastify.get('/health', async () => {
    return { status: 'ok', message: 'Fastify + PostgreSQL + Redis connected!' };
  });
}

module.exports = healthRoute;