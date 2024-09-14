'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import seedrandom from 'seedrandom';

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

const chartConfig = {} satisfies ChartConfig;

export function AstroChart({ data }: { data: Record<PropertyKey, number> }) {
  const chartData = Object.entries(data).map(([astroSign, nbrAstroSign]: [string, number]) => ({
    astroSign,
    nbrAstroSign,
    fill: colorScheme[Math.floor(seedrandom(astroSign)() * colorScheme.length)],
  }));

  const mostRepresentedAstroSign = chartData.reduce(
    (acc, data) => (data.nbrAstroSign > acc.nbrAstroSign ? data : acc),
    { astroSign: '', nbrAstroSign: 0 }
  );

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartiton par signe astrologique</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={chartData} dataKey="nbrAstroSign" nameKey="astroSign" />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Le signe astrologique le plus représenté est {mostRepresentedAstroSign.astroSign} avec{' '}
          {mostRepresentedAstroSign.nbrAstroSign} personnes
        </div>
      </CardFooter>
    </Card>
  );
}
