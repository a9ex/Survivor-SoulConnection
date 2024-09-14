/*
  Warnings:

  - Added the required column `phoneNumber` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "phoneNumber" TEXT NOT NULL;
