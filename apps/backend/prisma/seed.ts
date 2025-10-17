import { UserType } from '@prisma/client';
import bcrypt from 'bcryptjs';

import prisma from '../src/database/prisma';

async function main() {
  console.log('Seeding starts...');

  await prisma.user.deleteMany({
    where: {
      email: 'admin@admin.com',
    },
  });
  console.log('Previous admin user deleted (if existed).');

  const hashedPassword = await bcrypt.hash('admin', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@admin.com',
      password: hashedPassword,
      name: 'Admin',
      surname: 'User',
      type: UserType.ADMIN,
      sex: 'm',
      birthday: '1990-01-15T00:00:00.000Z',
      active: true,
    },
  });
  console.log(`Admin user created with ID: ${adminUser.id}`);

  const adminThread = await prisma.socialThread.create({
    data: {
      content: 'To jest mój pierwszy post wygenerowany przez seeda!',
      userId: adminUser.id,
      mediaUrls: ['https://example.com/image1.jpg'],
    },
  });
  console.log(`Social thread created with ID: ${adminThread.id}`);

  const adminLike = await prisma.socialThreadLike.create({
    data: {
      userId: adminUser.id,
      threadId: adminThread.id,
    },
  });
  console.log(`Like created with ID: ${adminLike.id}`);

  const adminComment = await prisma.socialThreadComment.create({
    data: {
      content: 'Świetny post! Dobra robota.',
      userId: adminUser.id,
      threadId: adminThread.id,
    },
  });
  console.log(`Comment created with ID: ${adminComment.id}`);

  const adminReply = await prisma.socialThreadComment.create({
    data: {
      content: 'Zgadzam się! Też tak uważam.',
      userId: adminUser.id,
      threadId: adminThread.id,
      parentId: adminComment.id,
    },
  });
  console.log(`Reply to comment created with ID: ${adminReply.id}`);

  const firstCommentLike = await prisma.socialThreadCommentLike.create({
    data: {
      userId: adminUser.id,
      commentId: adminComment.id,
    },
  });
  console.log(
    `Like for the first comment created with ID: ${firstCommentLike.id}`,
  );

  const replyLike = await prisma.socialThreadCommentLike.create({
    data: {
      userId: adminUser.id,
      commentId: adminReply.id,
    },
  });
  console.log(`Like for the reply created with ID: ${replyLike.id}`);

  const adminShare = await prisma.socialThreadShare.create({
    data: {
      content: 'Warto sprawdzić ten wątek!',
      userId: adminUser.id,
      threadId: adminThread.id,
    },
  });
  console.log(`Share created with ID: ${adminShare.id}`);

  console.log('Seeding finished successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
