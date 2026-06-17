import { db } from './index';
import { users } from './schema';
import { eq, sql } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🔑 Setting up real authentication...');

  const passwordHash = await bcrypt.hash('password123', 10);
  const userEmails = [
    'kwame.asante@kma.gov.gh',
    'abena.yiadom@kma.gov.gh',
    'john.mensah@kma.gov.gh',
    'esi.gyan@kma.gov.gh',
    'kwabena.danso@kma.gov.gh',
    'kofi.appiah@kma.gov.gh',
  ];

  for (const email of userEmails) {
    const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (existing) {
      await db.update(users).set({ passwordHash }).where(eq(users.id, existing.id));
      console.log(`  ✓ Updated password for ${email}`);
    } else {
      console.log(`  ✗ User ${email} not found — skipping`);
    }
  }

  const counts = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(users).then(r => Number(r[0].count)),
    db.execute(sql`SELECT count(*) FROM businesses`).then(r => Number(r.rows?.[0]?.count || 0)),
    db.execute(sql`SELECT count(*) FROM collections`).then(r => Number(r.rows?.[0]?.count || 0)),
    db.execute(sql`SELECT count(*) FROM anomalies`).then(r => Number(r.rows?.[0]?.count || 0)),
  ]);

  console.log(`\n📊 Database status:`);
  console.log(`  Users:       ${counts[0]}`);
  console.log(`  Businesses:  ${counts[1]}`);
  console.log(`  Collections: ${counts[2]}`);
  console.log(`  Anomalies:   ${counts[3]}`);

  const allUsers = await db.query.users.findMany();
  console.log('\n👤 Registered users:');
  for (const u of allUsers) {
    console.log(`  ${u.email} (${u.role}) — passwordHash: ${u.passwordHash ? 'set ✓' : 'MISSING ✗'}`);
  }

  console.log('\n✅ Auth setup complete!');
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
