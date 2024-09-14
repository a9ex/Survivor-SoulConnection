import fetcher from './fetcher';
import { writeFileSync } from 'fs';
import { prisma } from './prisma';
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const Employee = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  surname: z.string(),
  birth_date: z.string().transform((date) => new Date(date)),
  gender: z.string(),
  work: z.string(),
});

export async function migrateEmployees(): Promise<[number[], Map<number, number>]> {
  const ids = await fetcher.ids('/employees');
  const coaches: number[] = [];
  const map = new Map<number, number>();

  if (ids.success === false) {
    console.error('Failed to fetch employee IDs');
    return;
  }

  for (const id of ids.data) {
    const employee = await fetcher.get(`/employees/${id}`, Employee);

    if (employee.success === false) {
      console.error(`Failed to fetch employee ${id}`);
      continue;
    }

    console.log('Migrating employee', employee.data);

    const newEmployee = await prisma.employee.upsert({
      where: {
        externalId: employee.data.id,
      },
      update: {
        firstName: employee.data.name,
        lastName: employee.data.surname,
        email: employee.data.email,
        birthDate: employee.data.birth_date,
        gender: employee.data.gender,
        role: employee.data.work,
      },
      create: {
        externalId: employee.data.id,
        firstName: employee.data.name,
        lastName: employee.data.surname,
        email: employee.data.email,
        birthDate: employee.data.birth_date,
        gender: employee.data.gender,
        phoneNumber: faker.phone.number({ style: 'international' }),
        role: employee.data.work,
      },
    });

    if (newEmployee.role === 'Coach') {
      coaches.push(newEmployee.id);
    }

    map[employee.data.id] = newEmployee.id;

    const image = await fetcher.image(`/employees/${id}/image`);
    if (!image.success) {
      console.error(`Failed to fetch image for employee ${id}`);
      continue;
    }

    writeFileSync(`./public/employees/${newEmployee.id}.png`, image.data);
  }

  return [coaches, map];
}
