-- CreateTable
CREATE TABLE "SocialThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaUrls" TEXT[],

    CONSTRAINT "SocialThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialThreadLike" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialThreadLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialThreadComment" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialThreadComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SocialThreadShare" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT,

    CONSTRAINT "SocialThreadShare_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialThreadLike_userId_threadId_key" ON "SocialThreadLike"("userId", "threadId");

-- AddForeignKey
ALTER TABLE "SocialThread" ADD CONSTRAINT "SocialThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadLike" ADD CONSTRAINT "SocialThreadLike_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "SocialThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadLike" ADD CONSTRAINT "SocialThreadLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadComment" ADD CONSTRAINT "SocialThreadComment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "SocialThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadComment" ADD CONSTRAINT "SocialThreadComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadShare" ADD CONSTRAINT "SocialThreadShare_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "SocialThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadShare" ADD CONSTRAINT "SocialThreadShare_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
