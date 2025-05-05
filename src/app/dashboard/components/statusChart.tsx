"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

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

const statusColors = {
  todo: "#6366f1",      
  backlog: "#8b5cf6",   
  "in progress": "#ec4899", 
  done: "#10b981",      
  canceled: "#64748b",  
};

const statusChartConfig = {
  count: {
    label: "Count",
  },
  todo: {
    label: "To Do",
    color: statusColors.todo,
  },
  backlog: {
    label: "Backlog",
    color: statusColors.backlog,
  },
  "in progress": {
    label: "In Progress",
    color: statusColors["in progress"],
  },
  done: {
    label: "Done",
    color: statusColors.done,
  },
  canceled: {
    label: "Canceled",
    color: statusColors.canceled,
  },
} satisfies ChartConfig;

interface TaskStatusChartProps {
  data: {
    status: string;
    count: number;
  }[];
  totalTasks: number;
}

export function TaskStatusChart({ data, totalTasks }: TaskStatusChartProps) {
  const chartData = data?.map(item => ({
    ...item,
    fill: statusColors[item.status as keyof typeof statusColors] || "#64748b"
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Task Status Distribution</CardTitle>
        <CardDescription>Current status of all tasks</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={statusChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="status"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalTasks.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Total Tasks
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Real-time status overview
        </div>
        <div className="leading-none text-muted-foreground">
          Showing distribution of tasks by status
        </div>
      </CardFooter>
    </Card>
  );
}