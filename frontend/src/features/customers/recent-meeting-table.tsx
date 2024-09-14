'use client';

import React from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import type { Encounter } from './type';
import { LucideStar } from 'lucide-react';

export interface RecentMeetingTableProps {
  encounters: Encounter[];
}

export function RecentMeetingTable(props: RecentMeetingTableProps) {
  return (
    <Table aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>Date</TableColumn>
        <TableColumn>Note</TableColumn>
        <TableColumn>Commentaire</TableColumn>
        <TableColumn>Source</TableColumn>
      </TableHeader>
      <TableBody>
        {props.encounters
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
              <TableCell className="flex align-center justify-center">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <LucideStar
                      key={index}
                      className="w-4 h-4"
                      fill={index < encounter.rating ? '#000000' : 'transparent'}
                    />
                  ))}
              </TableCell>
              <TableCell>{encounter.comment}</TableCell>
              <TableCell>{encounter.source}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}
