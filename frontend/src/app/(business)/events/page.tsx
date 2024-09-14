import { fetchApi } from '@/lib/fetchApi';
import { auth } from '@/lib/auth';
import type { Event } from '@/features/events/type';
import moment from 'moment';
import { EventsWrapper } from '@/features/events/events-wrapper';


export default async function Events() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const events = await fetchApi<Event[]>('events', session);

  const calendarEvents = events.map((event) => ({
    title: event.name,
    start: new Date(event.date),
    end: moment(event.date).add(event.duration, 'minutes').toDate(),
    id: event.id,
  }));

  return (
    <div className="h-min-screen">
      <EventsWrapper events={events} calendarEvents={calendarEvents} />
    </div>
  );
}
