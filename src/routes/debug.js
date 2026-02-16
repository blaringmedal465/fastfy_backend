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

  // Full schema: All tables + their columns (name, type, nullable)
  fastify.get('/schema', async () => {
    const schema = await fastify.prisma.$queryRaw`
      SELECT 
        table_name, 
        column_name, 
        data_type, 
        is_nullable
      FROM information_schema.columns 
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position
    `;
    // Group by table
    const grouped = schema.reduce((acc, row) => {
      if (!acc[row.table_name]) acc[row.table_name] = [];
      acc[row.table_name].push({
        column: row.column_name,
        type: row.data_type,
        nullable: row.is_nullable === 'YES'
      });
      return acc;
    }, {});
    return { schema: grouped };
  });

  // List all users (data preview)
  fastify.get('/users', async () => {
    const users = await fastify.prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { users, count: users.length };
  });
}

module.exports = debugRoutes;