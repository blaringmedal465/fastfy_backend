async function testRedisRoute(fastify) {
  fastify.get('/test-redis', async () => {
    await fastify.redis.set('test', 'Hello from Redis!', 'EX', 60);
    const value = await fastify.redis.get('test');
    return { redisValue: value };
  });
}

module.exports = testRedisRoute;