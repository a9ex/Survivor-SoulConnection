-- DropForeignKey
ALTER TABLE "Encounter" DROP CONSTRAINT "Encounter_customerId_fkey";

-- AddForeignKey
ALTER TABLE "Encounter" ADD CONSTRAINT "Encounter_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
