"use client";

import React, { useState } from "react";
import { LeadScore } from "@/lib/lead-scoring";

interface LeadScoreBadgeProps {
  score: LeadScore;
  showScore?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * LeadScoreBadge - Visual score display
 * Shows the lead score as a colored badge with grade letter
 * Displays a tooltip/expandable breakdown on hover (desktop) or click (mobile)
 */
export function LeadScoreBadge({
  score,
  showScore = true,
  size = "md",
  className = "",
}: LeadScoreBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Color mapping based on grade
  const gradeColors: Record<string, { bg: string; text: string; border: string }> = {
    A: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    B: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
    C: { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-300" },
    D: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
    F: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  };

  const colors = gradeColors[score.grade];

  // Size mapping
  const sizeClasses: Record<string, { badge: string; text: string; score: string }> = {
    sm: { badge: "px-2 py-1", text: "text-xs font-bold", score: "text-xs" },
    md: { badge: "px-3 py-1.5", text: "text-sm font-bold", score: "text-xs" },
    lg: { badge: "px-4 py-2", text: "text-base font-bold", score: "text-sm" },
  };

  const sizes = sizeClasses[size];

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`
          inline-flex items-center gap-2 rounded-lg border-2
          ${colors.bg} ${colors.text} ${colors.border}
          ${sizes.badge} cursor-pointer transition-all
          hover:shadow-md active:scale-95
        `}
        onClick={() => setShowTooltip(!showTooltip)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setShowTooltip(!showTooltip);
          }
        }}
      >
        {/* Grade letter */}
        <div className={sizes.text}>{score.grade}</div>

        {/* Score number (optional) */}
        {showScore && <div className={sizes.score}>{score.score}</div>}
      </div>

      {/* Tooltip/Breakdown */}
      {showTooltip && (
        <div
          className={`
            absolute top-full left-0 mt-2 z-50
            bg-white rounded-lg shadow-lg border border-gray-200
            p-3 max-w-[calc(100vw-32px)] sm:min-w-max
          `}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-200">
            <div className={`w-10 h-10 rounded-lg ${colors.bg} ${colors.text} flex items-center justify-center font-bold text-lg`}>
              {score.grade}
            </div>
            <div>
              <div className="font-bold text-gray-900">{score.label}</div>
              <div className="text-xs text-gray-500">{score.score} points</div>
            </div>
          </div>

          {/* Factors breakdown */}
          <div className="space-y-2 mb-2 pb-2 border-b border-gray-200">
            <div className="text-xs font-semibold text-gray-700">Factors</div>
            {score.factors.map((factor) => (
              <div key={factor.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-700">{factor.name}</span>
                  <span className="font-semibold text-gray-900">
                    {factor.points}/{factor.maxPoints}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all"
                    style={{
                      width: `${(factor.points / factor.maxPoints) * 100}%`,
                    }}
                  />
                </div>
                <div className="text-xs text-gray-500">{factor.description}</div>
              </div>
            ))}
          </div>

          {/* Priority indicator */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-gray-200">
            <span className="text-gray-700">Priority:</span>
            <span
              className={`
                px-2 py-0.5 rounded font-semibold
                ${
                  score.priority === "urgent"
                    ? "bg-red-100 text-red-700"
                    : score.priority === "high"
                      ? "bg-orange-100 text-orange-700"
                      : score.priority === "medium"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                }
              `}
            >
              {score.priority.charAt(0).toUpperCase() + score.priority.slice(1)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
