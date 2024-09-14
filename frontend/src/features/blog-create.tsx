'use client';

import { Button, Card, CardBody, CardFooter, Input } from '@nextui-org/react';
import dynamic from 'next/dynamic';
import { EditorState } from 'draft-js';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { useEffect, useState } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import type { Session } from 'next-auth';
import { fetchApi } from '@/lib/fetchApi';
import { type Post } from '@/app/(business)/blog/page';
import { useRouter } from 'next/navigation';
import { stateFromHTML } from 'draft-js-import-html';

const Editor = dynamic(() => import('react-draft-wysiwyg').then((mod) => mod.Editor), { ssr: false });

export function CreatePost({ session, postData }: { session: Session, postData?: Post }) {
  const [editorState, setEditorState] = useState<EditorState>(EditorState.createEmpty());
  const [title, setTitle] = useState<string>('');
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const router = useRouter();

  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };

  const handlePublish = async (): Promise<void> => {
    const content = editorState.getCurrentContent();
    const htmlVersion = stateToHTML(content);
    const apiEndpoint = postData?.id ? `blog/edit/${postData.id}` : 'blog/create';
    setIsPosting(true);

    const post = await fetchApi<Post>(apiEndpoint, session, {
      method: postData?.id ? 'PUT' : 'POST',
      body: JSON.stringify({ title, content: htmlVersion }),
    });

    if (!post.id) {
      console.error('Error while publishing post');
      router.push(`/blog`);
    }

    router.push(`/blog/post/${post.id}`);
  };

  useEffect(() => {
    if (postData?.content) {
      const parsedContent = stateFromHTML(postData?.content);

      setTitle(postData?.title);
      setEditorState(EditorState.createWithContent(parsedContent));
    }
  }, []);

  return (
    <div className="max-w-5xl mt-12 mx-auto">
      <Card className="min-h-max">
        <CardBody>
          <Input label="Titre du post" className="mb-5" onChange={(e) => setTitle(e.target.value)} value={title} />
          <p className="text-medium">Contenu du post</p>
          <Editor editorState={editorState} onEditorStateChange={onEditorStateChange} />
        </CardBody>
        <CardFooter className="mt-10 flex justify-end">
          <Button color="primary" onClick={handlePublish} isLoading={isPosting}>
            Publier
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
