import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';
import { type Post } from '../../page';
import { Clock, Pencil } from 'lucide-react';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import Link from 'next/link';
import { Button } from '@nextui-org/react';
import { DeleteModal } from '@/features/delete-modal';

export default async function Page({ params }: { params: { id: string } }) {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const post = await fetchApi<Post>(`blog/post/${params.id}`, session);

  return (
    <div className="max-w-5xl mt-12 mx-auto">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-default-500 text-sm mt-1">
        Par {post.author.firstName} {post.author.lastName}
      </p>
      <div className="mt-2">
        <Clock size={16} className="text-default-500 inline mr-2" />
        <p className="text-default-500 text-sm inline">
          {formatRelative(new Date(post.createdAt), new Date(), { locale: fr })}
        </p>
        {session.user.id === post.authorId && (
          <div className="flex justify-end">
            <Link href={`/blog/edit/${post.id}`}>
              <Button color="primary" className="mr-4" size={'sm'} startContent={<Pencil size={16} />}>
                Modifier
              </Button>
            </Link>
              <DeleteModal id={post.id} session={session} size={"sm"} />
          </div>
        )}
      </div>
      <div className="mt-8" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
