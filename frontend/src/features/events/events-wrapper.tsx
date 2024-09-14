'use client';

import type { LatLngExpression } from 'leaflet';
import { useState } from 'react';
import type { CalendarEvent, Event } from './type';
import { EventsCalandar } from './calendar';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('@/features/events/map'), { ssr: false });

export function EventsWrapper({ events, calendarEvents }: { events: Event[]; calendarEvents: CalendarEvent[] }) {
  const firstEvent = events[0];
  const center =
    firstEvent !== undefined ? ([firstEvent.locationX, firstEvent.locationY] satisfies [number, number]) : undefined;
  const [eventLoc, setEventLoc] = useState<LatLngExpression | undefined>(center);

  return (
    <div className="flex flex-col gap-6">
      <div className="border border-gray-300 rounded-sm p-4 bg-background">
        <EventsCalandar calendarEvents={calendarEvents} events={events} setEventLoc={setEventLoc} />
      </div>
      <div className="border border-gray-300 rounded-sm p-4 bg-background">
        <Map events={events} eventLoc={eventLoc} />
      </div>
    </div>
  );
}
