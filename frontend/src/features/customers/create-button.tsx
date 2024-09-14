'use client';

import { Button, useDisclosure } from '@nextui-org/react';
import { CustomerCreateModal } from './create-modal';
import type { Customer } from './type';
import type { Coach } from '../coaches/table';

interface CreateButtonProps {
  create: (customer: Partial<Customer>) => Promise<boolean>;
  coaches: Coach[];
}

export function CreateButton(props: CreateButtonProps) {
  const { isOpen, onOpenChange, onOpen } = useDisclosure();

  return (
    <>
      <Button color="primary" onPress={onOpen}>
        Créer
      </Button>
      <CustomerCreateModal isOpen={isOpen} onOpenChange={onOpenChange} create={props.create} coaches={props.coaches} />
    </>
  );
}
