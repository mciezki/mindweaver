import { PrismaClient, UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding starts...');

  await prisma.user.deleteMany({
    where: {
      email: 'admin@admin.com',
    },
  });

  const hashedPassword = await bcrypt.hash('admin', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: hashedPassword,
      name: 'Admin',
      surname: 'User',
      type: UserType.ADMIN,
      sex: 'f',
      birthday: '2024-04-24T00:00:00.000Z',
      active: true,
    },
  });

  console.log(`Admin is created: ${adminUser.id}`);
  console.log('Seeding finished');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
