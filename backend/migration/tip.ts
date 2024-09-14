import fetcher from './fetcher';
import { prisma } from './prisma';
import { z } from 'zod';

const Tip = z.object({
  id: z.number(),
  title: z.string(),
  tip: z.string(),
});

export async function migrateTips() {
  const tipIds = await fetcher.get('/tips', Tip.array());

  if (!tipIds.success) {
    console.error('Failed to fetch tip ids');
    return;
  }

  for (const tip of tipIds.data) {
    console.log('Migrating tips', tip);
    await prisma.tip.upsert({
      where: {
        externalId: tip.id,
      },
      update: {
        title: tip.title,
        tip: tip.tip,
      },
      create: {
        externalId: tip.id,
        title: tip.title,
        tip: tip.tip,
      },
    });
  }
}
