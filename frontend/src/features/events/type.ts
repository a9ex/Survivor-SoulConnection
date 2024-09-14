export interface Event {
  id: number;
  name: string;
  type: string;
  maxParticipants: number;
  date: string;
  duration: number;
  location: string;
  locationX: number;
  locationY: number;
}

export interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  id: number;
}
