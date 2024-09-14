'use client';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import type { CalendarEvent, Event } from './type';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export function EventsCalandar({
  calendarEvents,
  events,
  setEventLoc,
}: {
  calendarEvents: CalendarEvent[];
  events: Event[];
  setEventLoc: (loc: [number, number]) => void;
}) {
  const localizer = momentLocalizer(moment);

  const handleOnSelectEvent = (event: CalendarEvent) => {
    const selectedEvent = events.find((e) => e.id === event.id);
    if (selectedEvent !== undefined) {
      setEventLoc([selectedEvent.locationX, selectedEvent.locationY]);
    }
  };

  return (
    <Calendar
      localizer={localizer}
      events={calendarEvents}
      // startAccessor="start"
      // endAccessor="end"
      style={{ height: 500 }}
      onSelectEvent={handleOnSelectEvent}
    />
    // <div>Calendar</div>
  );
}
