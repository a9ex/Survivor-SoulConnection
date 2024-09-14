'use client';

import { useState } from 'react';
import { imageURL } from '@/lib/fetchApi';
import { parseAbsoluteToLocal } from '@internationalized/date';
import type { Coach } from './table';

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
} from '@nextui-org/react';

export interface CoachModalProps {
  coach: Coach;
  isOpen: boolean;
  onOpenChange: () => void;
  updateCoach: (updatedCoach: Coach) => Promise<boolean>;
  removeCoach: (id: number) => Promise<boolean>;
  role: string;
}

export function CoachModal(props: CoachModalProps) {
  const [editable, setEditable] = useState<boolean>(false);
  const [firstName, setFirstName] = useState<string>(props.coach.firstName);
  const [lastName, setLastName] = useState<string>(props.coach.lastName);
  const [email, setEmail] = useState<string>(props.coach.email);
  const [phoneNumber, setPhoneNumber] = useState<string>(props.coach.phoneNumber);
  const [birthDate, setBirthDate] = useState<DateValue>(parseAbsoluteToLocal(props.coach.birthDate));
  const [gender, setGender] = useState<Selection>(new Set([props.coach.gender]));
  const [error, setError] = useState<boolean>(false);

  const onCancel = () => {
    setFirstName(props.coach.firstName);
    setLastName(props.coach.lastName);
    setEmail(props.coach.email);
    setPhoneNumber(props.coach.phoneNumber);
    setBirthDate(parseAbsoluteToLocal(props.coach.birthDate));
    setGender(new Set([props.coach.gender]));
    setEditable(false);
  };

  const onSave = async () => {
    const result = await props.updateCoach({
      ...props.coach,
      firstName,
      lastName,
      email,
      phoneNumber,
      birthDate: birthDate.toDate('Europe/Paris').toISOString(),
      gender: Array.from((gender as Set<string>).values())[0]!, // eslint-disable-line @typescript-eslint/no-non-null-assertion
    });

    if (!result) {
      setError(true);
    } else {
      setError(false);
      setEditable(false);
    }
  };

  const onDelete = async (close: () => void) => {
    const result = await props.removeCoach(props.coach.id);

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
              <Avatar src={imageURL(props.coach.image)} size="sm" />
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
              </div>
              {error && <span className="text-red-500">Une erreur est survenue.</span>}
            </ModalBody>
            <ModalFooter>
              {!editable && props.role === 'admin' && (
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
              {props.role === 'admin' && (
                <Button color="danger" variant="light" onPress={() => onDelete(onClose)}>
                  Supprimer
                </Button>
              )}
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
