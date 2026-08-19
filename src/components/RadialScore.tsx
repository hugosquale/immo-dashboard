"use client";

import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";

interface RadialScoreProps {
  score: number;
  color?: string;
}

export default function RadialScore({ score, color = "var(--accent-blue)" }: RadialScoreProps) {
  const data = [{ value: score, fill: color }];

  return (
    <div className="relative h-[68px] w-[68px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="72%"
          outerRadius="100%"
          barSize={6}
          data={data}
          startAngle={90}
          endAngle={-270}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} axisLine={false} />
          <RadialBar dataKey="value" cornerRadius={8} background={{ fill: "var(--surface-2)" }} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-base font-bold leading-none text-[var(--foreground)]">{Math.round(score)}</span>
      </div>
    </div>
  );
}
