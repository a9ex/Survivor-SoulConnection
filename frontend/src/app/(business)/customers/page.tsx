import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';

import { CustomersTable } from '@/features/customers/table';
import type { Customer } from '@/features/customers/type';
import type { Coach } from '@/features/coaches/table';

export default async function Customers() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const customers = await fetchApi<Customer[]>('customers/', session);
  const coaches = await fetchApi<Coach[]>('coaches/', session);

  return <CustomersTable customers={customers} coaches={coaches} session={session} />;
}
