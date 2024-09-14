import { auth } from '@/lib/auth';

import { Compatibility, type CompatibilityCustomer } from '@/features/compatibility';
import { Header } from '@/features/header';
import { fetchApi } from '@/lib/fetchApi';

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const customers = await fetchApi<CompatibilityCustomer[]>('compatibility/customers', session);

  return (
    <>
      <Header title="Compatibilité" subtitle="Vérifiez la compatibilité astrale entre deux clients !" />
      <Compatibility customers={customers} />
    </>
  );
}
