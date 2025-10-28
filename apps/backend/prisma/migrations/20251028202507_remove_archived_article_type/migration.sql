/*
  Warnings:

  - The values [ARCHIVED] on the enum `ArticleType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ArticleType_new" AS ENUM ('DRAFT', 'PUBLISHED');
ALTER TABLE "PublicationArticle" ALTER COLUMN "status" TYPE "ArticleType_new" USING ("status"::text::"ArticleType_new");
ALTER TYPE "ArticleType" RENAME TO "ArticleType_old";
ALTER TYPE "ArticleType_new" RENAME TO "ArticleType";
DROP TYPE "ArticleType_old";
COMMIT;
