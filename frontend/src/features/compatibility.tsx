'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import sr from 'seedrandom';
import { Autocomplete, AutocompleteItem, Progress } from '@nextui-org/react';

export interface CompatibilityCustomer {
  id: number;
  firstName: string;
  lastName: string;
  astrologicalSign: string;
  image: string;
}

export interface CompatibilityProps {
  customers: CompatibilityCustomer[];
}

interface CompatibilityChooserProps {
  customerKey: string | number | null | undefined;
  setCustomerKey: (key: string | number | null | undefined) => void;
  customer: CompatibilityCustomer | undefined;
  customers: CompatibilityCustomer[];
  label: string;
}

interface CompatibilityResultProps {
  first: CompatibilityCustomer | undefined;
  second: CompatibilityCustomer | undefined;
}

function CompatibilityChooser(props: CompatibilityChooserProps) {
  return (
    <div className="flex flex-col items-center">
      <Autocomplete
        defaultItems={props.customers}
        label={props.label}
        placeholder="Rechercher un client"
        className="max-w-xs"
        variant="bordered"
        selectedKey={props.customerKey}
        onSelectionChange={props.setCustomerKey}
      >
        {(customer) => (
          <AutocompleteItem key={customer.id}>{`${customer.firstName} ${customer.lastName}`}</AutocompleteItem>
        )}
      </Autocomplete>
      <div className="relative mt-6 lg:mt-12">
        <NextImage
          width={200}
          height={200}
          alt={props.label}
          src={props.customer ? `${process.env.NEXT_PUBLIC_API_URL}/${props.customer.image}` : '/empty.png'}
          className="w-32 h-32 rounded-full"
        />
        <NextImage
          width={20}
          height={20}
          alt={props.label}
          src={props.customer ? `/astro/${props.customer.astrologicalSign.toLowerCase()}.png` : '/empty.png'}
          className="w-12 h-12 absolute -top-2 right-0 rounded-full "
        />
      </div>
    </div>
  );
}

function CompatibilityResult(props: CompatibilityResultProps) {
  if (!props.first || !props.second) {
    return (
      <div className="px-8 py-4 bg-red-200 rounded-xl">
        <p className="text-red-800">Veuillez choisir deux clients pour afficher la compatibilité.</p>
      </div>
    );
  }

  const result = sr([props.first.astrologicalSign, props.second.astrologicalSign].toSorted().join('-')).quick() * 100;
  const bgColor = result <= 35 ? 'bg-red-200' : result < 65 ? 'bg-blue-200' : 'bg-green-200';
  const textColor = result <= 35 ? 'text-red-800' : result < 65 ? 'text-blue-800' : 'text-green-800';
  const message =
    result <= 35
      ? 'ne sont pas très compatible...'
      : result < 65
        ? 'sont plus ou moins compatibles.'
        : 'sont très compatibles !';

  return (
    <>
      <Progress
        color={result <= 35 ? 'danger' : result < 65 ? 'primary' : 'success'}
        aria-label="Compatibilité"
        value={result}
        className="w-1/3 mx-auto"
        showValueLabel
        classNames={{
          labelWrapper: ['relative'],
          value: ['text-center', 'absolute', 'left-0', 'right-0', 'bottom-3', 'text-3xl', 'font-bold', textColor],
        }}
      />
      <div className={`px-8 py-4 rounded-xl mt-8 ${bgColor}`}>
        <p className={textColor}>
          <span className="font-semibold">
            {props.first.firstName} {props.first.lastName}
          </span>{' '}
          et{' '}
          <span className="font-semibold">
            {props.second.firstName} {props.second.lastName}
          </span>{' '}
          {message}
        </p>
      </div>
    </>
  );
}

export function Compatibility(props: CompatibilityProps) {
  const [firstCustomerKey, setFirstCustomerKey] = useState<string | number | null | undefined>(null);
  const [secondCustomerKey, setSecondCustomerKey] = useState<string | number | null | undefined>(null);
  const firstCustomer = props.customers.find((customer) => customer.id === Number(firstCustomerKey));
  const secondCustomer = props.customers.find((customer) => customer.id === Number(secondCustomerKey));

  return (
    <div className="max-w-3xl mt-12 mx-auto ">
      <div className="grid grid-cols-1 lg:grid-cols-3 items-center justify-items-center gap-8 mb-20 lg:mb-8">
        <CompatibilityChooser
          customerKey={firstCustomerKey}
          setCustomerKey={setFirstCustomerKey}
          customer={firstCustomer}
          customers={props.customers.filter((customer) => customer.id !== Number(secondCustomerKey))}
          label="Premier client"
        />
        <NextImage width={96} height={96} src="/hearts.png" alt="Hearts" className="w-24 h-24" />
        <CompatibilityChooser
          customerKey={secondCustomerKey}
          setCustomerKey={setSecondCustomerKey}
          customer={secondCustomer}
          customers={props.customers.filter((customer) => customer.id !== Number(firstCustomerKey))}
          label="Deuxième client"
        />
      </div>
      <CompatibilityResult first={firstCustomer} second={secondCustomer} />
    </div>
  );
}
