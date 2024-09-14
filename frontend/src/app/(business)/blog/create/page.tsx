import { CreatePost } from '@/features/blog-create';
import { Header } from '@/features/header';
import { auth } from '@/lib/auth';

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  return (
    <>
      <Header title="Créer un article" subtitle="Partagez vos meilleurs conseils entre coachs !" />
      <CreatePost session={session} />
    </>
  );
}
