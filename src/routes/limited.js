async function limitedRoute(fastify) {
  fastify.get('/limited', async () => {
    return { message: 'This route is rate limited by Redis' };
  });
}

module.exports = limitedRoute;