import { AstroChart } from '@/features/charts/astrological-signs';
import { EventChart } from '@/features/charts/event-chart';
import { GenderRepChart } from '@/features/charts/gender-repartition';
import { MeetingsTopSourceChart } from '@/features/charts/meetings-top-source';
import { RatingChart } from '@/features/charts/ratings';
import { Header } from '@/features/header';
import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';
import type { Session } from 'next-auth';

async function fetchEventsByMonth(session: Session): Promise<Record<PropertyKey, number>> {
  const events = await fetchApi<Record<PropertyKey, number>>('dashboard/events-by-month', session);
  return events;
}

async function fetchMeetingsTopSource(session: Session): Promise<Record<PropertyKey, number>> {
  const events = await fetchApi<Record<PropertyKey, number>>('dashboard/meetings-top-source', session);
  return events;
}

async function fetchRatings(session: Session): Promise<Record<PropertyKey, number>> {
  const events = await fetchApi<Record<PropertyKey, number>>('dashboard/ratings', session);
  return events;
}

async function fetchAstro(session: Session): Promise<Record<PropertyKey, number>> {
  const events = await fetchApi<Record<PropertyKey, number>>('dashboard/astrological-signs', session);
  return events;
}

async function fetchGenderRep(session: Session): Promise<Record<PropertyKey, number>> {
  const events = await fetchApi<Record<PropertyKey, number>>('dashboard/gender-repartition', session);
  return events;
}

export default async function Page() {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion

  return (
    <div className="flex flex-col p-8">
      <Header title="Accueil" subtitle="Bienvenue !" />
      {/* Charts */}
      <div className="w-full grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <AstroChart data={await fetchAstro(session)} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <EventChart data={await fetchEventsByMonth(session)} />
        </div>
        <div className="col-span-12 xl:col-span-7">
          <RatingChart data={await fetchRatings(session)} />
        </div>
        <div className="col-span-12 xl:col-span-5">
          <MeetingsTopSourceChart data={await fetchMeetingsTopSource(session)} />
        </div>
        <div className="w-full col-span-12 xl:col-span-7">
          <GenderRepChart data={await fetchGenderRep(session)} />
        </div>
      </div>
    </div>
  );
}
