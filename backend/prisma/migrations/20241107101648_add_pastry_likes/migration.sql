-- DropIndex
DROP INDEX "pastry_media_pastry_id_key";

-- CreateTable
CREATE TABLE "pastry_likes" (
    "id" UUID NOT NULL,
    "pastry_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastry_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pastry_likes_pastry_id_user_id_key" ON "pastry_likes"("pastry_id", "user_id");

-- AddForeignKey
ALTER TABLE "pastry_likes" ADD CONSTRAINT "pastry_likes_pastry_id_fkey" FOREIGN KEY ("pastry_id") REFERENCES "pastries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastry_likes" ADD CONSTRAINT "pastry_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
