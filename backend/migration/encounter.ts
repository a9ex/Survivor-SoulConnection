import fetcher from './fetcher';
import { prisma } from './prisma';
import { z } from 'zod';

const Encounter = z.object({
  id: z.number(),
  customer_id: z.number(),
  date: z.string().transform((date) => new Date(date)),
  rating: z.number(),
  comment: z.string(),
  source: z.string(),
});

export async function migrateEncounters(map: Map<number, number>) {
  const encounterIds = await fetcher.ids('/encounters');

  if (!encounterIds.success) {
    console.error('Failed to fetch encounter ids');
    return;
  }

  for (const id of encounterIds.data) {
    const encounter = await fetcher.get(`/encounters/${id}`, Encounter);

    if (!encounter.success) {
      console.error(`Failed to fetch encounter ${id}`);
      continue;
    }

    console.log('Migrating encounter', encounter.data);

    await prisma.encounter.upsert({
      where: {
        externalId: encounter.data.id,
      },
      update: {
        date: encounter.data.date,
        customerId: map[encounter.data.customer_id],
        rating: encounter.data.rating,
        comment: encounter.data.comment,
        source: encounter.data.source,
      },
      create: {
        externalId: encounter.data.id,
        date: encounter.data.date,
        customerId: map[encounter.data.customer_id],
        rating: encounter.data.rating,
        comment: encounter.data.comment,
        source: encounter.data.source,
      },
    });
  }
}
