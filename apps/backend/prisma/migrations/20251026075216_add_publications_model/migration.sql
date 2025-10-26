-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ArticleRate" AS ENUM ('LIKE', 'DISLIKE');

-- CreateTable
CREATE TABLE "PublicationCategory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicationCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationArticle" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentHtml" TEXT NOT NULL,
    "coverImage" TEXT,
    "status" "ArticleType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "slug" TEXT,

    CONSTRAINT "PublicationArticle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationArticleComment" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PublicationArticleComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PublicationArticleRate" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rate" "ArticleRate" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationArticleRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PublicationCategory_userId_slug_key" ON "PublicationCategory"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationArticle_userId_slug_key" ON "PublicationArticle"("userId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "PublicationArticleRate_userId_articleId_key" ON "PublicationArticleRate"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "PublicationCategory" ADD CONSTRAINT "PublicationCategory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticle" ADD CONSTRAINT "PublicationArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticle" ADD CONSTRAINT "PublicationArticle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "PublicationCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticleComment" ADD CONSTRAINT "PublicationArticleComment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "PublicationArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticleComment" ADD CONSTRAINT "PublicationArticleComment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticleRate" ADD CONSTRAINT "PublicationArticleRate_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "PublicationArticle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationArticleRate" ADD CONSTRAINT "PublicationArticleRate_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
