'use client';

import { imageURL } from '@/lib/fetchApi';
import type { Customer } from './type';

import { User, Dropdown, DropdownTrigger, Button, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { Ellipsis } from 'lucide-react';

export const COLUMNS = [
  {
    name: 'Client',
    key: 'customer',
  },
  {
    name: 'Email',
    key: 'email',
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

export function CustomerCell(
  customer: Customer,
  column: string | number,
  onView: (id: number) => void,
  onEdit: (customer: Customer) => void,
  onDelete: (id: number) => void
) {
  switch (column) {
    case 'customer':
      return (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: imageURL(customer.image) }}
          classNames={{
            name: 'font-semibold',
            wrapper: 'ml-2',
          }}
          name={`${customer.firstName} ${customer.lastName}`}
        />
      );
    case 'email':
      return <span className="text-foreground-600">{customer.email}</span>;
    case 'phone':
      return <span className="text-foreground-600">{customer.phoneNumber}</span>;
    case 'actions':
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <Ellipsis className="text-foreground" />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem onClick={() => onView(customer.id)}>View</DropdownItem>
              <DropdownItem onClick={() => onEdit(customer)}>Edit</DropdownItem>
              <DropdownItem onClick={() => onDelete(customer.id)}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      return <div>unimplemented</div>;
  }
}
