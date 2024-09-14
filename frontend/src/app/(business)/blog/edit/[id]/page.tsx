import { CreatePost } from '@/features/blog-create';
import { Header } from '@/features/header';
import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';
import type { Post } from '../../page';


export default async function Page({ params }: { params: { id: string } }) {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const post = await fetchApi<Post>(`blog/post/${params.id}`, session);

  return (
    <>
      <Header title="Editer un article" subtitle="Partagez vos meilleurs conseils entre coachs !" />
      <CreatePost session={session} postData={post} />
    </>
  );
}
