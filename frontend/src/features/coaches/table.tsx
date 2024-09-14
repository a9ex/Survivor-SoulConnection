'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, useDisclosure } from '@nextui-org/react';
import { useCallback, useState } from 'react';
import { CoachCell, COLUMNS } from './columns';
import { CoachModal } from './modal';
import type { Session } from 'next-auth';
import { fetchApi } from '@/lib/fetchApi';
import { Header } from '../header';
import { CreateButton } from './create-button';

export interface Coach {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  gender: string;
  customers: number;
  image: string;
}

export interface CoachesTableProps {
  coaches: Coach[];
  session: Session;
}

export function CoachesTable(props: CoachesTableProps) {
  const [coaches, setCoaches] = useState<Coach[]>(props.coaches);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [coach, setCoach] = useState<Coach | null>(null);
  const renderCell = useCallback(CoachCell, []);

  const createCoach = async (customer: Partial<Coach> & { password?: string }) => {
    try {
      const newCoach = await fetchApi<Coach>('coaches', props.session, {
        method: 'POST',
        body: JSON.stringify(customer),
      });
      setCoaches((coaches) => [...coaches, newCoach]);
      return true;
    } catch (e) {
      return false;
    }
  };

  const updateCoach = async (updatedCoach: Coach) => {
    try {
      await fetchApi(`coaches/${updatedCoach.id}`, props.session, {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: updatedCoach.firstName,
          lastName: updatedCoach.lastName,
          email: updatedCoach.email,
          phoneNumber: updatedCoach.phoneNumber,
          birthDate: updatedCoach.birthDate,
          gender: updatedCoach.gender,
        }),
      });
      setCoaches((coaches) => coaches.map((coach) => (coach.id === updatedCoach.id ? updatedCoach : coach)));
      return true;
    } catch (e) {
      return false;
    }
  };

  const removeCoach = async (id: number) => {
    try {
      await fetchApi(`coaches/${id}`, props.session, {
        method: 'DELETE',
      });
      setCoaches((coaches) => coaches.filter((coach) => coach.id !== id));
      return true;
    } catch (e) {
      return false;
    }
  };

  return (
    <>
      <Header title="Coaches" subtitle={`Vous avez un total de ${coaches.length} coaches`}>
        {props.session.user.role === 'admin' && <CreateButton create={createCoach} />}
      </Header>
      <Table
        selectionMode="multiple"
        aria-label="Table des coaches"
        onRowAction={(key: string | number | bigint) => {
          setCoach(coaches.find((coach) => coach.id === Number(key)) || null);
          onOpen();
        }}
      >
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
        <TableBody items={coaches}>
          {(coach) => (
            <TableRow key={coach.id}>
              {(column) => (
                <TableCell>
                  {renderCell(coach, setCoach, onOpen, column, removeCoach, props.session.user.role)}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
      {coach && (
        <CoachModal
          key={coach.id}
          coach={coach}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
          updateCoach={updateCoach}
          removeCoach={removeCoach}
          role={props.session.user.role}
        />
      )}
    </>
  );
}
