/*
  Warnings:

  - You are about to drop the column `cover_image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `profile_name` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "cover_image",
DROP COLUMN "profile_image",
DROP COLUMN "profile_name",
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "profileName" TEXT;
