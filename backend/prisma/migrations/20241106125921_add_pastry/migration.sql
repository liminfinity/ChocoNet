-- CreateEnum
CREATE TYPE "PastryCategoryEnum" AS ENUM ('CAKES_AND_PASTRIES', 'COOKIES_AND_BISCUITS', 'CHOCOLATE_PRODUCTS', 'ICE_CREAM_AND_FROZEN_DESSERTS', 'CANDIES_AND_LOLLIPOPS', 'BAKED_GOODS_AND_SWEETS');

-- CreateEnum
CREATE TYPE "PastryUnit" AS ENUM ('GRAM', 'KILOGRAM', 'PIECE', 'LITER');

-- CreateTable
CREATE TABLE "pastries" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "description" TEXT,
    "unit" "PastryUnit" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pastry_contacts" (
    "id" UUID NOT NULL,
    "phone" TEXT NOT NULL,
    "pastry_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastry_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pastry_geolocations" (
    "id" UUID NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "pastry_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastry_geolocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pastry_media" (
    "id" UUID NOT NULL,
    "filename" TEXT NOT NULL,
    "pastry_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastry_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pastry_categories" (
    "id" UUID NOT NULL,
    "category" "PastryCategoryEnum" NOT NULL,
    "pastry_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pastry_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pastry_contacts_pastry_id_key" ON "pastry_contacts"("pastry_id");

-- CreateIndex
CREATE UNIQUE INDEX "pastry_geolocations_pastry_id_key" ON "pastry_geolocations"("pastry_id");

-- CreateIndex
CREATE UNIQUE INDEX "pastry_media_pastry_id_key" ON "pastry_media"("pastry_id");

-- AddForeignKey
ALTER TABLE "pastry_contacts" ADD CONSTRAINT "pastry_contacts_pastry_id_fkey" FOREIGN KEY ("pastry_id") REFERENCES "pastries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastry_geolocations" ADD CONSTRAINT "pastry_geolocations_pastry_id_fkey" FOREIGN KEY ("pastry_id") REFERENCES "pastries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastry_media" ADD CONSTRAINT "pastry_media_pastry_id_fkey" FOREIGN KEY ("pastry_id") REFERENCES "pastries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pastry_categories" ADD CONSTRAINT "pastry_categories_pastry_id_fkey" FOREIGN KEY ("pastry_id") REFERENCES "pastries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
