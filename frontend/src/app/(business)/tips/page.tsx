import { type Tip, Tips } from '@/features/tips';
import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const tips = await fetchApi<Tip[]>('tips', session);

  return <Tips tips={tips} />;
}
