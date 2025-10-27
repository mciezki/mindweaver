/*
  Warnings:

  - Added the required column `description` to the `PublicationCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PublicationCategory" ADD COLUMN     "description" TEXT NOT NULL;
