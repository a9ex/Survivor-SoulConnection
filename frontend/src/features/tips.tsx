'use client';

import { Accordion, AccordionItem } from '@nextui-org/react';

export interface Tip {
  id: number;
  title: string;
  tip: string;
}

export interface TipsProps {
  tips: Tip[];
}

export function Tips(props: TipsProps) {
  return (
    <Accordion className="border rounded-lg">
      {props.tips.map((section, index) => (
        <AccordionItem key={index} aria-label={section.title} title={section.title}>
          {section.tip}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
