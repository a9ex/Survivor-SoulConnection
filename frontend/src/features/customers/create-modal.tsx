'use client';

import { useState } from 'react';
import { imageURL } from '@/lib/fetchApi';
import { fromDate } from '@internationalized/date';
import type { Customer } from './type';

import {
  Modal,
  ModalContent,
  ModalHeader,
  Avatar,
  ModalBody,
  Input,
  DatePicker,
  Select,
  SelectItem,
  ModalFooter,
  Button,
  type DateValue,
  type Selection,
  Autocomplete,
  AutocompleteItem,
} from '@nextui-org/react';
import type { Coach } from '../coaches/table';

export interface CustomerModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  create: (data: Partial<Customer>) => Promise<boolean>;
  coaches: Coach[];
}

export function CustomerCreateModal(props: CustomerModalProps) {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState<DateValue>(fromDate(new Date(), 'Europe/Paris'));
  const [gender, setGender] = useState<Selection>(new Set(['Male']));
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [coachId, setCoachId] = useState<string | number | null>(null);
  const [error, setError] = useState<boolean>(false);

  const onSave = async (onClose: () => void) => {
    const result = await props.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate: birthDate.toDate('Europe/Paris').toISOString(),
      gender: Array.from((gender as Set<string>).values())[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      description,
      address,
      astrologicalSign: 'Pisces', // TODO: compute based on birthDate
      coachId: coachId ? Number(coachId) : undefined,
    });

    setError(!result);
    if (result) onClose();
  };

  return (
    <Modal size="xl" isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-4">
              <span className="font-bold text-xl self-end">
                {firstName} {lastName}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-3">
                <span className="font-bold">Prénom</span>
                <Input type="text" value={firstName} onValueChange={setFirstName} />
                <span className="font-bold">Nom</span>
                <Input type="text" value={lastName} onValueChange={setLastName} />
                <span className="font-bold">Email</span>
                <Input type="email" value={email} onValueChange={setEmail} />
                <span className="font-bold">Téléphone</span>
                <Input type="text" value={phoneNumber} onValueChange={setPhoneNumber} />
                <span className="font-bold">Date de naissance</span>
                <DatePicker granularity="day" showMonthAndYearPickers value={birthDate} onChange={setBirthDate} />
                <span className="font-bold">Genre</span>
                <Select selectedKeys={gender} onSelectionChange={setGender}>
                  <SelectItem key="Male">Homme</SelectItem>
                  <SelectItem key="Female">Femme</SelectItem>
                </Select>
                <span className="font-bold">Description</span>
                <Input type="text" value={description} onValueChange={setDescription} />
                <span className="font-bold">Addresse</span>
                <Input type="text" value={address} onValueChange={setAddress} />
                <span className="font-bold">Coach</span>
                <Autocomplete defaultItems={props.coaches} selectedKey={coachId} onSelectionChange={setCoachId}>
                  {(coach) => (
                    <AutocompleteItem key={coach.id}>{`${coach.firstName} ${coach.lastName}`}</AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              {error && <span className="text-red-500">Une erreur est survenue.</span>}
            </ModalBody>
            <ModalFooter>
              <Button color="success" variant="light" onPress={() => onSave(onClose)}>
                Enregistrer
              </Button>
              <Button color="danger" variant="light" onPress={onClose}>
                Fermer
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
