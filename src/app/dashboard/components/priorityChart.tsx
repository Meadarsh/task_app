"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const priorityColors = {
  low: "#10b981",    
  medium: "#f59e0b",
  high: "#ef4444",   
};

const priorityChartConfig = {
  count: {
    label: "Count",
  },
  low: {
    label: "Low Priority",
    color: priorityColors.low,
  },
  medium: {
    label: "Medium Priority",
    color: priorityColors.medium,
  },
  high: {
    label: "High Priority",
    color: priorityColors.high,
  },
} satisfies ChartConfig;

interface TaskPriorityChartProps {
  data: {
    priority: string;
    count: number;
  }[];
}

export function TaskPriorityChart({ data }: TaskPriorityChartProps) {
  const chartData = data?.map(item => ({
    ...item,
    fill: priorityColors[item.priority as keyof typeof priorityColors] || "#64748b"
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Task Priority Distribution</CardTitle>
        <CardDescription>Breakdown by priority level</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={priorityChartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="priority"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.charAt(0).toUpperCase() + value.slice(1)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar 
              dataKey="count" 
              fill="fill" // Use the fill property from our mapped data
              radius={8} 
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Task priority overview
        </div>
        <div className="leading-none text-muted-foreground">
          Showing number of tasks by priority level
        </div>
      </CardFooter>
    </Card>
  );
}