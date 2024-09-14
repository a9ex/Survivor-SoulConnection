'use client';

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Event } from './type';

import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect } from 'react';
import type { LatLngExpression } from 'leaflet';

export interface MapProps {
  events: Event[];
  eventLoc?: LatLngExpression;
}

function View({ eventLoc }: { eventLoc?: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    if (eventLoc !== undefined) {
      map.flyTo(eventLoc, 13);
    }
  }, [eventLoc]);
  return null;
}

export default function Map(props: MapProps) {
  const firstEvent = props.events[0];
  const center =
    firstEvent !== undefined ? ([firstEvent.locationX, firstEvent.locationY] satisfies [number, number]) : undefined;

  return (
    <MapContainer center={center} zoom={8} scrollWheelZoom={true} className="h-[500px]">
      <View eventLoc={props.eventLoc} />
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {props.events.map((event, index) => (
        <Marker key={index} position={[event.locationX, event.locationY]}>
          <Popup>
            <div>
              <h4 className="font-bold">{event.location}</h4>
              <h5 className="font-semibold">{event.type}</h5>
              <div>{event.name}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
