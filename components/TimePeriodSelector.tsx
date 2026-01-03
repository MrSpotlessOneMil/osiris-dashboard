"use client";

import { useState } from "react";

type Period = "today" | "week" | "month";

interface TimePeriodSelectorProps {
  onPeriodChange?: (period: Period) => void;
}

export function TimePeriodSelector({ onPeriodChange }: TimePeriodSelectorProps) {
  const [selected, setSelected] = useState<Period>("today");

  const periods: { value: Period; label: string }[] = [
    { value: "today", label: "Today" },
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
  ];

  const handleChange = (period: Period) => {
    setSelected(period);
    onPeriodChange?.(period);
  };

  return (
    <div className="inline-flex items-center gap-2 glass-card rounded-full p-1">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => handleChange(period.value)}
          className={`px-6 py-2 rounded-full text-xs font-medium uppercase tracking-wider ${
            selected === period.value
              ? "bg-purple-400/20 text-purple-400"
              : "text-zinc-600 hover:text-zinc-400"
          }`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
