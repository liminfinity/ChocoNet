/*
  Warnings:

  - You are about to drop the column `userId` on the `avatars` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `geolocations` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `geolocations` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `geolocations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "avatars" DROP CONSTRAINT "avatars_userId_fkey";

-- DropForeignKey
ALTER TABLE "geolocations" DROP CONSTRAINT "geolocations_userId_fkey";

-- DropIndex
DROP INDEX "geolocations_userId_key";

-- AlterTable
ALTER TABLE "avatars" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "geolocations" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_id_token_key" ON "refresh_tokens"("id", "token");

-- CreateIndex
CREATE UNIQUE INDEX "geolocations_user_id_key" ON "geolocations"("user_id");

-- AddForeignKey
ALTER TABLE "geolocations" ADD CONSTRAINT "geolocations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "avatars" ADD CONSTRAINT "avatars_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
