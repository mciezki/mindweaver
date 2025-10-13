-- AlterTable
ALTER TABLE "SocialThreadComment" ADD COLUMN     "parentId" TEXT;

-- CreateTable
CREATE TABLE "SocialThreadCommentLike" (
    "id" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialThreadCommentLike_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SocialThreadCommentLike_commentId_userId_key" ON "SocialThreadCommentLike"("commentId", "userId");

-- AddForeignKey
ALTER TABLE "SocialThreadComment" ADD CONSTRAINT "SocialThreadComment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SocialThreadComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadCommentLike" ADD CONSTRAINT "SocialThreadCommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "SocialThreadComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SocialThreadCommentLike" ADD CONSTRAINT "SocialThreadCommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
