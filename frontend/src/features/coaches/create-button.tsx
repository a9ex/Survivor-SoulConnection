'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { CoachCreateModal } from './create-modal';
import type { Coach } from './table';

interface CreateButtonProps {
  create: (customer: Partial<Coach> & { password?: string }) => Promise<boolean>;
}

export function CreateButton(props: CreateButtonProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Créer
      </Button>
      <CoachCreateModal isOpen={isOpen} onOpenChange={onOpenChange} create={props.create} />
    </>
  );
}
