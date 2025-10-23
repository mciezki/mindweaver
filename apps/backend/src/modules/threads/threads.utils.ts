import { Prisma } from '@prisma/client';

export const fullThreadSelectShape: Prisma.SocialThreadSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  mediaUrls: true,
  originalThreadId: true,
  user: {
    select: {
      id: true,
      profileName: true,
      name: true,
      surname: true,
      type: true,
      profileImage: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: true,
      shares: true,
    },
  },
};

export const simpleThreadSelectShape: Prisma.SocialThreadSelect = {
  id: true,
  content: true,
  createdAt: true,
  updatedAt: true,
  mediaUrls: true,
  originalThreadId: true,
  user: {
    select: {
      id: true,
      profileName: true,
      name: true,
      surname: true,
      type: true,
      profileImage: true,
    },
  },
};
