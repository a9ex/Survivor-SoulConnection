import type { Coach } from '@/features/coaches/table';
import { PaymentHistoryTable } from '@/features/customers/payment-history-table';
import { RecentMeetingTable } from '@/features/customers/recent-meeting-table';
import type { DetailedCustomer } from '@/features/customers/type';
import { Header } from '@/features/header';
import { auth } from '@/lib/auth';
import { fetchApi } from '@/lib/fetchApi';
import { LucideBookmark, LucideMail } from 'lucide-react';
import NextImage from 'next/image';

export default async function Page({ params }: { params: { id: string } }) {
  const session = (await auth())!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
  const user = await fetchApi<DetailedCustomer>(`customers/${params.id}`, session);
  const coach = user.coachId ? await fetchApi<Coach>(`coaches/${user.coachId}`, session) : null;

  return (
    <div className="w-full">
      <Header title="Détails du client" />
      <div className="flex xl:flex-row flex-col gap-6">
        <div className="flex flex-col xl:w-7/12 w-full bg-background border border-gray-300 rounded-md">
          <div className="p-6 flex justify-center items-center w-full border-b border-gray-300">
            <div className="flex flex-col justify-center items-center gap-4">
              <NextImage
                width={200}
                height={200}
                alt={user.firstName}
                src={user ? `${process.env.NEXT_PUBLIC_API_URL}/${user.image}` : '/astro/black.png'}
                className="w-20 h-20 rounded-full"
              />
              <h1 className="font-bold text-xl">
                {user.firstName} {user.lastName}
              </h1>
            </div>
          </div>
          <div className="flex justify-center items-center w-full h-24 border-b border-gray-300">
            <div className="flex gap-6">
              <LucideMail size={24} className="cursor-pointer" />
              <LucideBookmark size={24} className="cursor-pointer" />
            </div>
          </div>
          <div className="w-full border-b border-gray-300 pt-8 pb-6">
            <div className="flex justify-around items-start">
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bold text-xl text-center">{user.encounters.length}</h1>
                <h1 className="text-center">
                  Total <br /> encounter
                </h1>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bold text-xl text-center">
                  {user.encounters.filter((encounter) => encounter.rating >= 3).length}
                </h1>
                <h1 className="text-center">Positives</h1>
              </div>
              <div className="flex flex-col justify-center items-center">
                <h1 className="font-bold text-xl text-center">0</h1>
                <h1 className="text-center">In Progress</h1>
              </div>
            </div>
          </div>
          <div className="w-full p-4 flex flex-col gap-4">
            <p className="font-bold text-sm uppercase">Détails</p>
            <div className="flex flex-col">
              <p className="font-semibold">ID:</p>
              <p>{user.id}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Email:</p>
              <p>{user.email}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Adresse:</p>
              <p>{user.address}</p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Dernière activité:</p>
              <p>
                {user.encounters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]?.date
                  ? new Date(
                      user.encounters.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]!.date //eslint-disable-line
                    ).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="font-semibold">Coach:</p>
              <p>{coach ? `${coach.firstName} ${coach.lastName}` : 'N/A'}</p>
            </div>
          </div>
        </div>
        <div className="p-4 w-full h-fit border border-gray-300 rounded-lg flex flex-col gap-6 bg-background">
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Dernières Recontres</p>
            <RecentMeetingTable encounters={user.encounters} />
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-semibold">Historique de paiement</p>
            <PaymentHistoryTable payments={user.payments} />
          </div>
        </div>
      </div>
    </div>
  );
}
