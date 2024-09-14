'use client';

import { fetchApi } from '@/lib/fetchApi';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react';
import { Trash } from 'lucide-react';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

export function DeleteModal({ id, session, size, refresh = false }: { id: number; session: Session, size?: 'sm' | 'md' | 'lg', refresh?: boolean }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();

  const handleDelete = async (): Promise<void> => {
    await fetchApi(`blog/post/${id}`, session, {
      method: 'DELETE',
    });
    onOpenChange();
    (refresh ? router.refresh() : router.push(`/blog`));
  };

  return (
    <>
      <Button color="danger" size={size} startContent={<Trash size={16} />} onPress={onOpen}>
        Supprimer
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Supprimer le post</ModalHeader>
              <ModalBody>
                <p>Êtes-vous sûr de vouloir supprimer ce post ?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  Annuler
                </Button>
                <Button color="danger" onClick={handleDelete}>
                  Supprimer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
