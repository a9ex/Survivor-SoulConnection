/*
  Warnings:

  - The `externalId` column on the `Clothe` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `Customer` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `Employee` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `Encounter` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `Event` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `PaymentRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `externalId` column on the `Tip` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Clothe" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "Encounter" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "PaymentRecord" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;

-- AlterTable
ALTER TABLE "Tip" DROP COLUMN "externalId",
ADD COLUMN     "externalId" INTEGER;
