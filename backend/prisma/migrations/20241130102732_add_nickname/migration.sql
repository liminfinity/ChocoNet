/*
  Warnings:

  - A unique constraint covering the columns `[nickname]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nickname` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "nickname" VARCHAR(255) NOT NULL;

-- CreateIndex
CREATE INDEX "pastries_name_idx" ON "pastries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_nickname_key" ON "users"("nickname");
