import { auth } from '@/lib/auth';

import { Wardrobe, type WardrobeCustomer } from '@/features/wardrobe';
import { Header } from '@/features/header';
import { fetchApi } from '@/lib/fetchApi';

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const customers = await fetchApi<WardrobeCustomer[]>('wardrobe/customers', session);

  return (
    <>
      <Header title="Garde-robe" subtitle="Testez des combinaisons de vêtements pour vos clients !" />
      <Wardrobe customers={customers} session={session} />
    </>
  );
}
