'use client';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartConfig = {
  rating: {
    label: 'Notation',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function RatingChart({ data }: { data: Record<PropertyKey, number> }) {
  console.log(data);
  const chartData = Object.entries(data).map(([rating, nbrRating]: [string, number]) => ({
    note: Number(rating),
    total: nbrRating,
  }));

  const averageRating =
    chartData.reduce((acc, data) => acc + data.note * data.total, 0) /
    chartData.reduce((acc, data) => acc + data.total, 0);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Notation des rencontres</CardTitle>
        <CardDescription>Depuis toujours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="note"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="total" fill="#ba2738" radius={8}>
              <LabelList position="top" offset={12} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">Moyenne de notation à {averageRating.toFixed(1)}/5</div>
      </CardFooter>
    </Card>
  );
}
