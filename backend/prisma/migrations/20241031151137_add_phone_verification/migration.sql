/*
  Warnings:

  - You are about to drop the column `path` on the `avatars` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `verification_codes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[filename]` on the table `avatars` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,email]` on the table `verification_codes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `filename` to the `avatars` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `verification_codes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "VerificationCodeType" ADD VALUE 'PHONE_CONFIRMATION';

-- DropForeignKey
ALTER TABLE "verification_codes" DROP CONSTRAINT "verification_codes_user_id_fkey";

-- DropIndex
DROP INDEX "avatars_path_key";

-- AlterTable
ALTER TABLE "avatars" DROP COLUMN "path",
ADD COLUMN     "filename" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "verification_codes" DROP COLUMN "user_id",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "phone_verification" (
    "id" UUID NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" UUID NOT NULL,

    CONSTRAINT "phone_verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "phone_verification_user_id_key" ON "phone_verification"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "avatars_filename_key" ON "avatars"("filename");

-- CreateIndex
CREATE UNIQUE INDEX "verification_codes_type_email_key" ON "verification_codes"("type", "email");

-- AddForeignKey
ALTER TABLE "verification_codes" ADD CONSTRAINT "verification_codes_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "phone_verification" ADD CONSTRAINT "phone_verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
