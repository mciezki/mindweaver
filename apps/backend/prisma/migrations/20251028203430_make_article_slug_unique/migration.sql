/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `PublicationArticle` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "PublicationArticle_userId_slug_key";

-- CreateIndex
CREATE UNIQUE INDEX "PublicationArticle_slug_key" ON "PublicationArticle"("slug");
