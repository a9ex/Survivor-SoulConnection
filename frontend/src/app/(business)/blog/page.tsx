import { DeleteModal } from '@/features/delete-modal';
import { Header } from '@/features/header';
import { auth } from '@/lib/auth';
import { fetchApi, imageURL } from '@/lib/fetchApi';
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Image } from '@nextui-org/react';
import { formatRelative } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Pencil } from 'lucide-react';
import Link from 'next/link';
import { Fragment } from 'react';

export interface Post {
  id: number;
  authorId: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: {
    firstName: string;
    lastName: string;
  };
}

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const posts = await fetchApi<Post[]>('blog/posts', session);

  return (
    <>
      <Header title="Blog" subtitle="Partagez vos meilleurs conseils entre coachs !" />
      <div className="flex justify-end">
        <Link href="/blog/create">
          <Button color="primary">Créer un article</Button>
        </Link>
      </div>
      <div className="mt-14">
        <div className="grid grid-cols-1 xl:grid-cols-3 items-center justify-items-center gap-4 mb-20 lg:mb-8">
          {posts.map((post, i) => (
            <Fragment key={i}>
              <Card className="md:w-[450px]">
                <CardHeader>
                  <Image
                    src={imageURL(`static/employees/${post.authorId}.png`)}
                    alt="Blog"
                    height={40}
                    width={40}
                    radius="sm"
                  />
                  <div className="flex flex-col ml-4">
                    <p className="text-lg font-bold">
                      {post.author.firstName} {post.author.lastName}
                    </p>
                    <p className="text-sm text-default-500">
                      {formatRelative(new Date(post.updatedAt), new Date(), { locale: fr })}
                    </p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="mt-2">
                  <p className="text-lg font-bold">{post.title}</p>
                </CardBody>
                <Divider />
                <CardFooter>
                  <Link href={`/blog/post/${post.id}`}>
                    <Button color="default" className="mr-3">
                      Lire la suite
                    </Button>
                  </Link>
                  {post.authorId === session.user.id && (
                    <>
                      <Link href={`/blog/edit/${post.id}`}>
                        <Button color="secondary" className="mr-3" startContent={<Pencil size={16} />}>
                          Modifier
                        </Button>
                      </Link>
                      <DeleteModal id={post.id} session={session} size={"md"} refresh={true}/>
                    </>
                  )}
                </CardFooter>
              </Card>
            </Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
