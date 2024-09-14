'use client';

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import type { Payment } from './type';

export interface PaymentHistoryTableProps {
  payments: Payment[];
}

export function PaymentHistoryTable(props: PaymentHistoryTableProps) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Méthode</TableColumn>
        <TableColumn>Valeur</TableColumn>
        <TableColumn>Commentaire</TableColumn>
      </TableHeader>
      <TableBody>
        {props.payments
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((encounter, i) => (
            <TableRow key={i}>
              <TableCell className="text-primary font-semibold w-2/12">
                {new Date(encounter.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell>{encounter.paymentMethod}</TableCell>
              <TableCell className="font-bold">{-encounter.amount}$</TableCell>
              <TableCell>{encounter.comment}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
