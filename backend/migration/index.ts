import { mkdir } from 'fs';
import { migrateEmployees } from './employee';
import { migrateCustomers } from './customer';
import { migrateEncounters } from './encounter';
import { migrateEvents } from './event';
import { migrateTips } from './tip';

(async () => {
  // Create directories for images
  await mkdir('./public/employees', { recursive: true }, () => {});
  await mkdir('./public/customers', { recursive: true }, () => {});
  await mkdir('./public/clothes', { recursive: true }, () => {});

  // Migrate data
  const [coaches, employeesMap] = await migrateEmployees();
  const customersMap = await migrateCustomers(coaches);
  await migrateEncounters(customersMap);
  await migrateEvents(employeesMap);
  await migrateTips();

  console.log('Migration completed.');
})();
