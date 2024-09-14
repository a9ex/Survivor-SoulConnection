/*
  Warnings:

  - Added the required column `phoneNumber` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "phoneNumber" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Clothe" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "imageUri" TEXT NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Clothe_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Clothe" ADD CONSTRAINT "Clothe_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
