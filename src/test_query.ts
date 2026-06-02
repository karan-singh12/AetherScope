import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Running raw query for daily requests...");
  try {
    const rows = await prisma.$queryRaw`
      SELECT to_char(timestamp::date, 'YYYY-MM-DD') as day, COUNT(*) as count
      FROM "InferenceLog"
      GROUP BY day
      ORDER BY day DESC
      LIMIT 30
    `;
    console.log("Query Succeeded! Rows:", rows);
  } catch (e: any) {
    console.error("Query Failed with error:", e.message || e);
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
