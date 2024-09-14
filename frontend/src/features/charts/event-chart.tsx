'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  views: {
    label: 'Evènements',
  },
  events: {
    label: 'Evènements',
    color: '#f31260',
  },
} satisfies ChartConfig;

export function EventChart({ data }: { data: Record<PropertyKey, number> }) {
  const chartData = Object.entries(data).map(([date, events]: [string, number]) => ({
    date: `${Math.trunc(Number(date) / 12)}-${(Number(date) % 12) + 1}`,
    events,
  }));

  const yearlyAvg = chartData
    .filter((data) => data.date.startsWith(new Date().getFullYear().toString()))
    .reduce((acc, data) => acc + data.events, 0);
  const monthlyAvg = chartData[chartData.length - 1]?.events ?? 0;

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Évènements</CardTitle>
          <CardDescription>Nos évènements et leurs status</CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Cette année</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">{yearlyAvg}</span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <span className="text-xs text-muted-foreground">Ce mois-ci</span>
            <span className="text-lg font-bold leading-none sm:text-3xl">{monthlyAvg}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('fr-FR', {
                  month: 'short',
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('fr-FR', {
                      month: 'long',
                      year: 'numeric',
                    });
                  }}
                />
              }
            />
            <Bar dataKey={'events'} fill="#f31260" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
