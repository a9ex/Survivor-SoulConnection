'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import seedrandom from 'seedrandom';

export const description = 'Principaux moyens de rencontre';

const colorScheme = [
  '#16a085',
  '#f39c12',
  '#e74c3c',
  '#833471',
  '#A3CB38',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#ecf0f1',
  '#95a5a6',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#bdc3c7',
  '#7f8c8d',
  '#55efc4',
  '#81ecec',
  '#74b9ff',
  '#a29bfe',
  '#dfe6e9',
  '#00b894',
  '#00cec9',
  '#0984e3',
  '#6c5ce7',
  '#ffeaa7',
  '#fab1a0',
  '#ff7675',
  '#fd79a8',
  '#fdcb6e',
  '#e17055',
  '#d63031',
  '#feca57',
  '#5f27cd',
  '#54a0ff',
  '#01a3a4',
];

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  conference: {
    label: 'Conférence',
    color: 'hsl(var(--chart-1))',
  },
  gym: {
    label: 'Sport',
    color: 'hsl(var(--chart-2))',
  },
  ['family friend']: {
    label: 'Famille/Amis',
    color: 'hsl(var(--chart-3))',
  },
  concert: {
    label: 'Concert',
    color: 'hsl(var(--chart-4))',
  },
  ['coffee shop']: {
    label: 'Café/Bar',
    color: 'hsl(var(--chart-5))',
  },
  ['mutual acquaintance']: {
    label: 'Connaissance commune',
    color: 'hsl(var(--chart-4))',
  },
  library: {
    label: 'Bibliothèque',
    color: 'hsl(var(--chart-5))',
  },
  ['travel group']: {
    label: 'Groupe de voyage',
    color: 'hsl(var(--chart-4))',
  },
  ['sports club']: {
    label: 'Club de sport',
    color: 'hsl(var(--chart-5))',
  },
  school: {
    label: 'Ecole',
    color: 'hsl(var(--chart-5))',
  },
  ['dating app']: {
    label: 'Application de rencontre',
    color: 'hsl(var(--chart-5))',
  },
  ['book club']: {
    label: 'Club de lecture',
    color: 'hsl(var(--chart-5))',
  },
  ['hobby group']: {
    label: 'Groupe de loisirs',
    color: 'hsl(var(--chart-5))',
  },
  restaurant: {
    label: 'Restaurant',
    color: 'hsl(var(--chart-5))',
  },
  event: {
    label: 'Evènement',
    color: 'hsl(var(--chart-5))',
  },
  work: {
    label: 'Travail',
    color: 'hsl(var(--chart-5))',
  },
  park: {
    label: 'Parc',
    color: 'hsl(var(--chart-5))',
  },
  ['online forum']: {
    label: 'Forum en ligne',
    color: 'hsl(var(--chart-5))',
  },
  ['social media']: {
    label: 'Réseaux sociaux',
    color: 'hsl(var(--chart-5))',
  },
  neighborhood: {
    label: 'Voisinage',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export function MeetingsTopSourceChart({ data }: { data: Record<PropertyKey, number> }) {
  const chartData = Object.entries(data).map(([browser, visitors]: [string, number]) => ({
    browser,
    visitors,
    fill: colorScheme[Math.floor(seedrandom(browser).quick() * colorScheme.length)],
  }));

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Principaux moyen de rencontre</CardTitle>
        <CardDescription>Depuis toujours</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="visitors" nameKey="browser" innerRadius={60} />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Affichage du nombre total de rencontres depuis toujours
        </div>
      </CardFooter>
    </Card>
  );
}
