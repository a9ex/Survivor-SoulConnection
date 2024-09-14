import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';

import { type Coach, CoachesTable } from '@/features/coaches/table';

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const coaches = await fetchApi<Coach[]>('coaches/', session);

  return <CoachesTable coaches={coaches} session={session} />;
}
