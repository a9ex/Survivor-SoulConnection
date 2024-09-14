'use client';

import { fetchApi, imageURL } from '@/lib/fetchApi';
import { Autocomplete, AutocompleteItem, Card, CardBody, CardHeader } from '@nextui-org/react';
import NextImage from 'next/image';
import type { Session } from 'next-auth';
import { useState } from 'react';

export interface WardrobeCustomer {
  id: number;
  firstName: string;
  lastName: string;
  description: string;
  image: string;
}

export interface WardrobeClothe {
  id: number;
  image: string;
}

export interface WardrobeCustomerClothes {
  hatsAndCaps: WardrobeClothe[];
  tops: WardrobeClothe[];
  bottoms: WardrobeClothe[];
  shoes: WardrobeClothe[];
}

export interface WardrobeProps {
  customers: WardrobeCustomer[];
  session: Session;
}

interface ClotheSelectionProps {
  clothes: WardrobeClothe[];
  label: string;
  selected: WardrobeClothe | null;
  setSelected: (clothe: WardrobeClothe | null) => void;
}

function ClotheSelection(props: ClotheSelectionProps) {
  return (
    <Card>
      <CardHeader className="pb-0">
        <h4 className="text-foreground font-bold text-xl">{props.label}</h4>
      </CardHeader>
      <CardBody>
        <div className="flex gap-2 mx-2">
          {props.clothes.map((clothe, index) => (
            <NextImage
              key={clothe.id}
              width={200}
              height={200}
              src={imageURL(clothe.image)}
              alt={`${props.label} ${index}`}
              className={`aspect-square object-cover rounded-xl w-24 h-24 ${clothe.id === props.selected?.id ? 'border-3 border-primary' : ''}`}
              onClick={() => props.setSelected(clothe)}
            />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}

export function Wardrobe(props: WardrobeProps) {
  const [customerKey, setCustomerKey] = useState<string | number | null>(null);
  const [clothes, setClothes] = useState<WardrobeCustomerClothes | null>(null);

  const [selectedHat, setSelectedHat] = useState<WardrobeClothe | null>(null);
  const [selectedTop, setSelectedTop] = useState<WardrobeClothe | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<WardrobeClothe | null>(null);
  const [selectedShoe, setSelectedShoe] = useState<WardrobeClothe | null>(null);

  const customer = props.customers.find((customer) => customer.id === Number(customerKey));

  const onSelectionChange = async (key: string | number | null) => {
    setCustomerKey(key);
    setClothes(key !== null ? await fetchApi(`wardrobe/customers/${key}`, props.session) : null);
    setSelectedHat(null);
    setSelectedTop(null);
    setSelectedBottom(null);
    setSelectedShoe(null);
  };

  return (
    <>
      <div className="flex gap-4">
        <NextImage
          width={200}
          height={200}
          alt="Selected person"
          src={customer ? imageURL(customer.image) : '/empty.png'}
          className="w-32 h-32 rounded-xl"
        />
        <div className="max-w-xs">
          <Autocomplete
            defaultItems={props.customers}
            label="Client"
            placeholder="Rechercher un client"
            variant="bordered"
            selectedKey={customerKey}
            onSelectionChange={onSelectionChange}
          >
            {(customer) => (
              <AutocompleteItem key={customer.id}>{`${customer.firstName} ${customer.lastName}`}</AutocompleteItem>
            )}
          </Autocomplete>
          <p className="text-foreground-700 mt-2 text-justify">{customer?.description}</p>
        </div>
      </div>
      {clothes && (
        <>
          <div className="grid grid-rows-4 grid-cols-1 sm:grid-cols-[1fr,auto] mt-4 gap-4">
            <ClotheSelection
              label="Hats and caps"
              clothes={clothes.hatsAndCaps}
              selected={selectedHat}
              setSelected={setSelectedHat}
            />
            <NextImage
              width={200}
              height={200}
              src={selectedHat ? imageURL(selectedHat.image) : '/empty.png'}
              alt="Hat or cap"
              className="w-40 object-cover rounded-xl h-40 hidden sm:block"
            />
            <ClotheSelection label="Tops" clothes={clothes.tops} selected={selectedTop} setSelected={setSelectedTop} />
            <NextImage
              width={200}
              height={200}
              src={selectedTop ? imageURL(selectedTop.image) : '/empty.png'}
              alt="Top"
              className="w-40 object-cover rounded-xl h-40 hidden sm:block"
            />
            <ClotheSelection
              label="Bottoms"
              clothes={clothes.bottoms}
              selected={selectedBottom}
              setSelected={setSelectedBottom}
            />
            <NextImage
              width={200}
              height={200}
              src={selectedBottom ? imageURL(selectedBottom.image) : '/empty.png'}
              alt="Bottom"
              className="w-40 object-cover rounded-xl h-40 hidden sm:block"
            />
            <ClotheSelection
              label="Shoes"
              clothes={clothes.shoes}
              selected={selectedShoe}
              setSelected={setSelectedShoe}
            />
            <NextImage
              width={200}
              height={200}
              src={selectedShoe ? imageURL(selectedShoe.image) : '/empty.png'}
              alt="Shoe"
              className="w-40 object-cover rounded-xl h-40 hidden sm:block"
            />
          </div>
          <div className="sm:hidden flex flex-col gap-4 mt-4 items-center">
            <NextImage
              width={200}
              height={200}
              src={selectedHat ? imageURL(selectedHat.image) : '/empty.png'}
              alt="Hat or cap"
              className="w-40 object-cover rounded-xl h-40"
            />
            <NextImage
              width={200}
              height={200}
              src={selectedTop ? imageURL(selectedTop.image) : '/empty.png'}
              alt="Top"
              className="w-40 object-cover rounded-xl h-40"
            />
            <NextImage
              width={200}
              height={200}
              src={selectedBottom ? imageURL(selectedBottom.image) : '/empty.png'}
              alt="Bottom"
              className="w-40 object-cover rounded-xl h-40"
            />
            <NextImage
              width={200}
              height={200}
              src={selectedShoe ? imageURL(selectedShoe.image) : '/empty.png'}
              alt="Shoe"
              className="w-40 object-cover rounded-xl h-40"
            />
          </div>
        </>
      )}
    </>
  );
}
