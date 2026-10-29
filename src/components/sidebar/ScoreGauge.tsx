"use client";

import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number; // 0 to 100
  size?: number; // width & height in px
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  type?: "ai" | "cleanliness" | "neutral";
  animate?: boolean;
}

export function ScoreGauge({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  sublabel,
  type = "ai",
  animate = true,
}: ScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(animate ? 0 : score);

  useEffect(() => {
    if (!animate) {
      setAnimatedScore(score);
      return;
    }
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score, animate]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Determine color based on score and type
  let colorClass = "text-indigo-600";
  let bgTrackClass = "stroke-slate-100 dark:stroke-slate-800";

  if (type === "ai") {
    // For AI: High is red/danger, low is green/human
    if (score >= 75) {
      colorClass = "text-rose-500 stroke-rose-500";
    } else if (score >= 40) {
      colorClass = "text-amber-500 stroke-amber-500";
    } else {
      colorClass = "text-emerald-500 stroke-emerald-500";
    }
  } else if (type === "cleanliness") {
    // For cleanliness: High is green, low is red
    if (score >= 85) {
      colorClass = "text-emerald-500 stroke-emerald-500";
    } else if (score >= 60) {
      colorClass = "text-amber-500 stroke-amber-500";
    } else {
      colorClass = "text-rose-500 stroke-rose-500";
    }
  } else {
    colorClass = "text-indigo-500 stroke-indigo-500";
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90 transform" viewBox={`0 0 ${size} ${size}`}>
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={bgTrackClass}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={`${colorClass} transition-all duration-1000 ease-out`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center score readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            {animatedScore}%
          </span>
          {label && (
            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
              {label}
            </span>
          )}
        </div>
      </div>

      {sublabel && (
        <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-400 text-center">
          {sublabel}
        </span>
      )}
    </div>
  );
}
