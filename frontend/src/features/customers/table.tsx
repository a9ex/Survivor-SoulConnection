'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { CustomerCell, COLUMNS } from './columns';
import type { Session } from 'next-auth';
import type { Customer } from './type';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/fetchApi';
import { CustomerViewEditModal } from './view-edit-modal';
import { Header } from '../header';
import { CreateButton } from './create-button';
import type { Coach } from '../coaches/table';

export interface CoachesTableProps {
  customers: Customer[];
  coaches: Coach[];
  session: Session;
}

export function CustomersTable(props: CoachesTableProps) {
  const renderCell = useCallback(CustomerCell, []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [customers, setCustomers] = useState<Customer[]>(props.customers);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const router = useRouter();

  const create = async (customer: Partial<Customer>) => {
    try {
      const newCustomer = await fetchApi<Customer>('customers', props.session, {
        method: 'POST',
        body: JSON.stringify(customer),
      });
      setCustomers((customers) => [...customers, newCustomer]);
      return true;
    } catch (e) {
      return false;
    }
  };

  const update = async (data: Customer) => {
    try {
      await fetchApi(`customers/${data.id}`, props.session, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          birthDate: data.birthDate,
          gender: data.gender,
          description: data.description,
          coachId: data.coachId,
        }),
      });
      setCustomers((customers) => customers.map((customer) => (customer.id === data.id ? data : customer)));
      return true;
    } catch (e) {
      return false;
    }
  };

  const remove = async (id: number) => {
    try {
      await fetchApi(`customers/${id}`, props.session, {
        method: 'DELETE',
      });
      setCustomers((coaches) => coaches.filter((coach) => coach.id !== id));
      return true;
    } catch (e) {
      return false;
    }
  };

  const onView = (id: number) => {
    router.push(`/customers/${id}`);
  };

  const onEdit = (customer: Customer) => {
    setCustomer(customer);
    onOpen();
  };

  return (
    <>
      <Header title="Clients" subtitle={`Vous avez ${customers.length} clients`}>
        <CreateButton create={create} coaches={props.coaches} />
      </Header>
      <Table selectionMode="multiple" aria-label="Table des clients" onRowAction={(key) => onView(Number(key))}>
        <TableHeader columns={COLUMNS}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === 'actions' ? 'end' : 'start'}
              className={column.key === 'actions' ? 'text-end' : undefined}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={customers}>
          {(coach) => (
            <TableRow key={coach.id}>
              {(column) => <TableCell>{renderCell(coach, column, onView, onEdit, remove)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {customer && (
        <CustomerViewEditModal
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          customer={customer}
          coaches={props.coaches}
          update={update}
          remove={remove}
        />
      )}
    </>
  );
}
