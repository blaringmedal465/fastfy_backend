async function debugRoutes(fastify) {
  // List all tables
  fastify.get('/tables', async () => {
    const tables = await fastify.prisma.$queryRaw`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    return { tables: tables.map(t => t.tablename) };
  });

  // List all users (for testing)
  fastify.get('/users', async () => {
    const users = await fastify.prisma.user.findMany();
    return { users, count: users.length };
  });
}

module.exports = debugRoutes;