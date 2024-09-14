import fetcher from './fetcher';
import { prisma } from './prisma';
import { z } from 'zod';

const Event = z.object({
  id: z.number(),
  name: z.string(),
  date: z.string().transform((date) => new Date(date)),
  duration: z.number(),
  max_participants: z.number(),
  location_x: z.string().transform((x) => parseFloat(x)),
  location_y: z.string().transform((y) => parseFloat(y)),
  type: z.string(),
  employee_id: z.number(),
  location_name: z.string(),
});

export async function migrateEvents(map: Map<number, number>) {
  const eventIds = await fetcher.ids('/events');

  if (!eventIds.success) {
    console.error('Failed to fetch event ids');
    return;
  }

  for (const id of eventIds.data) {
    const event = await fetcher.get(`/events/${id}`, Event);

    if (!event.success) {
      console.error(`Failed to fetch event ${id}`);
      continue;
    }

    console.log('Migrating event', event.data);

    await prisma.event.upsert({
      where: {
        externalId: event.data.id,
      },
      update: {
        name: event.data.name,
        date: event.data.date,
        duration: event.data.duration,
        maxParticipants: event.data.max_participants,
        locationX: event.data.location_x,
        locationY: event.data.location_y,
        type: event.data.type,
        employeeId: map[event.data.employee_id],
        location: event.data.location_name,
      },
      create: {
        externalId: event.data.id,
        name: event.data.name,
        date: event.data.date,
        duration: event.data.duration,
        maxParticipants: event.data.max_participants,
        locationX: event.data.location_x,
        locationY: event.data.location_y,
        type: event.data.type,
        employeeId: map[event.data.employee_id],
        location: event.data.location_name,
      },
    });
  }
}
