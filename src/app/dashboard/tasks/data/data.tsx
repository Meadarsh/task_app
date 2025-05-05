import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CheckCircle,
  Circle,
  CircleOff,
  HelpCircle,
  Timer,
} from "lucide-react";

export const labels = [
  {
    value: "bug",
    label: "Bug",
  },
  {
    value: "feature",
    label: "Feature",
  },
  {
    value: "documentation",
    label: "Documentation",
  },
];

export const statuses = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
    color: "#8b5cf6",
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
    color: "#6366f1",
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: Timer,
    color: "#ec4899",
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle,
    color: "#10b981",
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: CircleOff,
    color: "#64748b",
  },
];

export const priorities = [
  {
    label: "Low",
    value: "low",
    icon: ArrowDown,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRight,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUp,
  },
];
