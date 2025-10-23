/*
  Warnings:

  - You are about to drop the `SocialThreadShare` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocialThreadShare" DROP CONSTRAINT "SocialThreadShare_threadId_fkey";

-- DropForeignKey
ALTER TABLE "SocialThreadShare" DROP CONSTRAINT "SocialThreadShare_userId_fkey";

-- AlterTable
ALTER TABLE "SocialThread" ADD COLUMN     "originalThreadId" TEXT,
ALTER COLUMN "content" DROP NOT NULL;

-- DropTable
DROP TABLE "SocialThreadShare";

-- AddForeignKey
ALTER TABLE "SocialThread" ADD CONSTRAINT "SocialThread_originalThreadId_fkey" FOREIGN KEY ("originalThreadId") REFERENCES "SocialThread"("id") ON DELETE SET NULL ON UPDATE CASCADE;
