'use client';

import { imageURL } from '@/lib/fetchApi';
import type { Coach } from './table';

import { User, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Ellipsis } from 'lucide-react';

export const COLUMNS = [
  {
    name: 'Coach',
    key: 'coach',
  },
  {
    name: 'Email',
    key: 'email',
  },
  {
    name: 'Nombre de clients',
    key: 'customers',
  },
  {
    name: 'Téléphone',
    key: 'phone',
  },
  {
    name: 'Actions',
    key: 'actions',
  },
];

export function CoachCell(
  coach: Coach,
  setCoach: (coach: Coach) => void,
  onOpen: () => void,
  column: string | number,
  removeCoach: (id: number) => Promise<boolean>,
  role: string
) {
  switch (column) {
    case 'coach':
      return (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: imageURL(coach.image) }}
          classNames={{
            name: 'font-semibold',
            wrapper: 'ml-2',
          }}
          name={`${coach.firstName} ${coach.lastName}`}
        />
      );
    case 'email':
      return <span className="text-foreground-600">{coach.email}</span>;
    case 'phone':
      return <span className="text-foreground-600">{coach.phoneNumber}</span>;
    case 'customers':
      return <span className="text-foreground-600">{coach.customers}</span>;
    case 'actions':
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <Ellipsis className="text-foreground" />
              </Button>
            </DropdownTrigger>
            {role === 'admin' ? (
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setCoach(coach);
                    onOpen();
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  onClick={() => {
                    setCoach(coach);
                    onOpen();
                  }}
                >
                  Edit
                </DropdownItem>
                <DropdownItem onClick={() => removeCoach(coach.id)}>Delete</DropdownItem>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownItem
                  onClick={() => {
                    setCoach(coach);
                    onOpen();
                  }}
                >
                  View
                </DropdownItem>
              </DropdownMenu>
            )}
          </Dropdown>
        </div>
      );
    default:
      return <div>unimplemented</div>;
  }
}
