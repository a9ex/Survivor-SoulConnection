import fetcher from './fetcher';
import { writeFileSync } from 'fs';
import { prisma } from './prisma';
import { z } from 'zod';

const Customer = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  surname: z.string(),
  birth_date: z.string().transform((date) => new Date(date)),
  gender: z.string(),
  description: z.string(),
  astrological_sign: z.string(),
  phone_number: z.string(),
  address: z.string(),
});

const PaymentRecord = z.object({
  id: z.number(),
  date: z.string().transform((date) => new Date(date)),
  payment_method: z.string(),
  amount: z.number(),
  comment: z.string(),
});

const Clothe = z.object({
  id: z.number(),
  type: z.string(),
});

export async function migratePaymentsHistory(oldCustomerId: number, newCustomerId: number) {
  const paymentHistory = await fetcher.get(`/customers/${oldCustomerId}/payments_history`, PaymentRecord.array());

  if (!paymentHistory.success) {
    console.error(`Failed to fetch payment history for customer ${oldCustomerId}`);
    return;
  }

  for (const record of paymentHistory.data) {
    console.log('Migrating payment record', record);
    await prisma.paymentRecord.upsert({
      where: {
        externalId: record.id,
      },
      update: {
        date: record.date,
        paymentMethod: record.payment_method,
        amount: record.amount,
        comment: record.comment,
        customerId: newCustomerId,
      },
      create: {
        externalId: record.id,
        date: record.date,
        paymentMethod: record.payment_method,
        amount: record.amount,
        comment: record.comment,
        customerId: newCustomerId,
      },
    });
  }
}

export async function migrateClothes(oldCustomerId: number, newCustomerId: number) {
  const clothes = await fetcher.get(`/customers/${oldCustomerId}/clothes`, Clothe.array());

  if (!clothes.success) {
    console.error(`Failed to fetch clothes for customer ${oldCustomerId}`);
    return;
  }

  for (const clothe of clothes.data) {
    console.log('Migrating clothe', clothe);
    const newClothe = await prisma.clothe.upsert({
      where: {
        externalId: clothe.id,
      },
      update: {
        type: clothe.type,
        customerId: newCustomerId,
      },
      create: {
        externalId: clothe.id,
        type: clothe.type,
        customerId: newCustomerId,
      },
    });

    const image = await fetcher.image(`/clothes/${clothe.id}/image`);
    if (!image.success) {
      console.error(`Failed to fetch image for clothe ${clothe.id}`);
      continue;
    }
    writeFileSync(`./public/clothes/${newClothe.id}.png`, image.data);
  }
}

export async function migrateCustomers(coaches: number[]): Promise<Map<number, number>> {
  const ids = await fetcher.ids('/customers');
  const map = new Map<number, number>();

  if (!ids.success) {
    console.error('Failed to fetch customer IDs');
    return;
  }

  let coachIndex = 0;

  for (const id of ids.data) {
    const customer = await fetcher.get(`/customers/${id}`, Customer);

    if (!customer.success) {
      console.error(`Failed to fetch customer ${id}`);
      continue;
    }

    let phoneNumber = customer.data.phone_number
      .replaceAll('(', '')
      .replaceAll(')', '')
      .replaceAll('+33', '')
      .replaceAll(' ', '');

    if (phoneNumber.length !== 10) {
      phoneNumber = '0' + phoneNumber;
    }

    console.log('Migrating customer', customer.data);
    const newCustomer = await prisma.customer.upsert({
      where: {
        externalId: customer.data.id,
      },
      update: {
        firstName: customer.data.name,
        lastName: customer.data.surname,
        email: customer.data.email,
        birthDate: customer.data.birth_date,
        gender: customer.data.gender,
        description: customer.data.description,
        astrologicalSign: customer.data.astrological_sign,
        phoneNumber,
        address: customer.data.address,
      },
      create: {
        externalId: customer.data.id,
        firstName: customer.data.name,
        lastName: customer.data.surname,
        email: customer.data.email,
        birthDate: customer.data.birth_date,
        gender: customer.data.gender,
        description: customer.data.description,
        astrologicalSign: customer.data.astrological_sign,
        phoneNumber,
        address: customer.data.address,
        coachId: coaches[coachIndex++ % coaches.length],
      },
    });

    map[customer.data.id] = newCustomer.id;

    const image = await fetcher.image(`/customers/${id}/image`);
    if (!image.success) {
      console.error(`Failed to fetch image for customer ${id}`);
      continue;
    }
    writeFileSync(`./public/customers/${newCustomer.id}.png`, image.data);

    await migratePaymentsHistory(id, newCustomer.id);
    await migrateClothes(id, newCustomer.id);
  }

  return map;
}
