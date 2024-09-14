'use client';

import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  female: {
    label: 'Femme',
    color: 'hsl(220 70% 50%)',
  },
  male: {
    label: 'Homme',
    color: 'hsl(340 75% 55%)',
  },
} satisfies ChartConfig;

export function GenderRepChart({ data }: { data: Record<PropertyKey, number> }) {
  const chartData = [Object.fromEntries(Object.entries(data).map(([key, value]) => [key.toLowerCase(), value]))];
  const totalCustomers = chartData.reduce((sum, currentObject) => {
    const objectSum = Object.values(currentObject).reduce((acc, value) => acc + value, 0);
    return sum + objectSum;
  }, 0);

  const genderMajority = Object.entries(data).reduce((acc, value) => (value[1] > acc[1] ? value : acc), ['', 0]);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Répartition par Sexe</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
          <RadialBarChart data={chartData} endAngle={180} innerRadius={80} outerRadius={130}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                          {totalCustomers}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                          Clients
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="female"
              stackId="a"
              cornerRadius={5}
              fill="hsl(220 70% 50%)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="male"
              fill="hsl(340 75% 55%)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp size={24} className="fill-current" />
          <div>
            {genderMajority[0]}s sont majoritaires avec {genderMajority[1]} clients
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
