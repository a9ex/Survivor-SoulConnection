'use client';

import { useState } from 'react';
import { imageURL } from '@/lib/fetchApi';
import { parseAbsoluteToLocal } from '@internationalized/date';
import type { Customer } from './type';
import type { Coach } from '../coaches/table';

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

export interface CustomerModalProps {
  customer: Customer;
  coaches: Coach[];
  isOpen: boolean;
  onOpenChange: () => void;
  update: (data: Customer) => Promise<boolean>;
  remove: (id: number) => Promise<boolean>;
}

export function CustomerViewEditModal(props: CustomerModalProps) {
  const [editable, setEditable] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(props.customer.firstName);
  const [lastName, setLastName] = useState<string>(props.customer.lastName);
  const [email, setEmail] = useState<string>(props.customer.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(props.customer.phoneNumber);
  const [birthDate, setBirthDate] = useState<DateValue>(parseAbsoluteToLocal(props.customer.birthDate));
  const [gender, setGender] = useState<Selection>(new Set([props.customer.gender]));
  const [description, setDescription] = useState<string>(props.customer.description);
  const [coachId, setCoachId] = useState<string | number | null>(props.customer.coachId?.toString());
  const [error, setError] = useState<boolean>(false);

  const onCancel = () => {
    setFirstName(props.customer.firstName);
    setLastName(props.customer.lastName);
    setEmail(props.customer.email);
    setPhoneNumber(props.customer.phoneNumber);
    setBirthDate(parseAbsoluteToLocal(props.customer.birthDate));
    setGender(new Set([props.customer.gender]));
    setDescription(props.customer.description);
    setCoachId(props.customer.coachId);
    setEditable(false);
  };

  const onSave = async () => {
    const result = await props.update({
      ...props.customer,
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate: birthDate.toDate('Europe/Paris').toISOString(),
      gender: Array.from((gender as Set<string>).values())[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
      description,
      coachId: Number(coachId),
    });

    if (!result) {
      setError(true);
    } else {
      setError(false);
      setEditable(false);
    }
  };

  const onDelete = async (close: () => void) => {
    const result = await props.remove(props.customer.id);

    if (result) {
      close();
    } else {
      setError(true);
    }
  };

  return (
    <Modal size="xl" isOpen={props.isOpen} onOpenChange={props.onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center gap-4">
              <Avatar src={imageURL(props.customer.image)} size="sm" />
              <span className="font-bold text-xl self-end">
                {firstName} {lastName}
              </span>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-[auto,1fr] items-center gap-x-4 gap-y-3">
                <span className="font-bold">Prénom</span>
                <Input type="text" value={firstName} onValueChange={setFirstName} isDisabled={!editable} />
                <span className="font-bold">Nom</span>
                <Input type="text" value={lastName} onValueChange={setLastName} isDisabled={!editable} />
                <span className="font-bold">Email</span>
                <Input type="email" value={email} onValueChange={setEmail} isDisabled={!editable} />
                <span className="font-bold">Téléphone</span>
                <Input type="text" value={phoneNumber} onValueChange={setPhoneNumber} isDisabled={!editable} />
                <span className="font-bold">Date de naissance</span>
                <DatePicker
                  granularity="day"
                  showMonthAndYearPickers
                  value={birthDate}
                  onChange={setBirthDate}
                  isDisabled={!editable}
                />
                <span className="font-bold">Genre</span>
                <Select selectedKeys={gender} onSelectionChange={setGender} isDisabled={!editable}>
                  <SelectItem key="Male">Homme</SelectItem>
                  <SelectItem key="Female">Femme</SelectItem>
                </Select>
                <span className="font-bold">Description</span>
                <Input type="text" value={description} onValueChange={setDescription} isDisabled={!editable} />
                <span className="font-bold">Coach</span>
                <Autocomplete
                  defaultItems={props.coaches}
                  selectedKey={coachId}
                  onSelectionChange={setCoachId}
                  isDisabled={!editable}
                >
                  {(coach) => (
                    <AutocompleteItem key={coach.id}>{`${coach.firstName} ${coach.lastName}`}</AutocompleteItem>
                  )}
                </Autocomplete>
              </div>
              {error && <span className="text-red-500">Une erreur est survenue.</span>}
            </ModalBody>
            <ModalFooter>
              {!editable && (
                <Button color="secondary" variant="light" onPress={() => setEditable((editable) => !editable)}>
                  Modifier
                </Button>
              )}
              {editable && (
                <>
                  <Button color="success" variant="light" onPress={onSave}>
                    Enregistrer
                  </Button>
                  <Button color="danger" variant="light" onPress={onCancel}>
                    Annuler
                  </Button>
                </>
              )}
              <Button color="danger" variant="light" onPress={() => onDelete(onClose)}>
                Supprimer
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
