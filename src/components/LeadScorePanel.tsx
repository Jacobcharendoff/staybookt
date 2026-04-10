"use client";

import React from "react";
import { LeadScore } from "@/lib/lead-scoring";
import { LeadScoreBadge } from "./LeadScoreBadge";

interface LeadScorePanelProps {
  score: LeadScore;
  contactName?: string;
  className?: string;
}

/**
 * LeadScorePanel - Detailed score breakdown
 * Shows overall score with circular progress, grade badge, factor breakdown,
 * recommendations list, and priority indicator
 */
export function LeadScorePanel({
  score,
  contactName,
  className = "",
}: LeadScorePanelProps) {
  // Color mapping for grade
  const gradeColors: Record<string, { bg: string; text: string; ring: string }> = {
    A: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
    B: { bg: "bg-blue-50", text: "text-blue-700", ring: "ring-blue-200" },
    C: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
    D: { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
    F: { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
  };

  const colors = gradeColors[score.grade];

  // Priority colors
  const priorityColors: Record<string, { bg: string; text: string; icon: string }> = {
    urgent: { bg: "bg-red-100", text: "text-red-700", icon: "🔴" },
    high: { bg: "bg-orange-100", text: "text-orange-700", icon: "🟠" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700", icon: "🟡" },
    low: { bg: "bg-gray-100", text: "text-gray-700", icon: "⚪" },
  };

  const priorityStyle = priorityColors[score.priority];

  return (
    <div
      className={`
        rounded-xl border border-gray-200 p-6 space-y-6
        ${colors.bg} ${className}
      `}
    >
      {/* Header Section */}
      <div className="space-y-4">
        {/* Title */}
        {contactName && (
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{contactName}</h3>
              <p className="text-sm text-gray-600">Lead Qualification Score</p>
            </div>
          </div>
        )}

        {/* Score Circle + Grade */}
        <div className="flex items-center gap-6">
          {/* Circular Progress */}
          <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0">
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 120 120"
            >
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-gray-300"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="54"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className={`
                  transition-all duration-500
                  ${
                    score.grade === "A"
                      ? "text-green-500"
                      : score.grade === "B"
                        ? "text-blue-500"
                        : score.grade === "C"
                          ? "text-amber-500"
                          : score.grade === "D"
                            ? "text-orange-500"
                            : "text-red-500"
                  }
                `}
                strokeDasharray={`${(score.score / 100) * 2 * Math.PI * 54} ${2 * Math.PI * 54}`}
                strokeLinecap="round"
              />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-gray-900">{score.score}</div>
              <div className="text-xs text-gray-600">/ 100</div>
            </div>
          </div>

          {/* Grade info */}
          <div className="space-y-4 flex-1">
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Grade</div>
              <LeadScoreBadge score={score} size="lg" showScore={false} />
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Label</div>
              <p className={`text-lg font-semibold ${colors.text}`}>
                {score.label}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300/50" />

      {/* Factors Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Score Breakdown</h4>
        <div className="space-y-3">
          {score.factors.map((factor) => {
            const percentage = (factor.points / factor.maxPoints) * 100;
            return (
              <div key={factor.name} className="space-y-1">
                {/* Factor name and score */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    {factor.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {factor.points}/{factor.maxPoints}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`
                      h-full rounded-full transition-all duration-300
                      ${
                        percentage >= 75
                          ? "bg-green-500"
                          : percentage >= 50
                            ? "bg-blue-500"
                            : percentage >= 25
                              ? "bg-amber-500"
                              : "bg-red-500"
                      }
                    `}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Description */}
                <p className="text-xs text-gray-600">{factor.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300/50" />

      {/* Priority Section */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700">Priority:</span>
        <div
          className={`
            inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
            ${priorityStyle.bg} ${priorityStyle.text} font-semibold
          `}
        >
          <span>{priorityStyle.icon}</span>
          {score.priority.charAt(0).toUpperCase() + score.priority.slice(1)}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300/50" />

      {/* Recommendations */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900">Recommended Actions</h4>
        {score.recommendations.length > 0 ? (
          <ul className="space-y-2">
            {score.recommendations.map((recommendation, index) => (
              <li key={index} className="flex gap-3 text-sm text-gray-700">
                <span className="text-blue-500 font-bold mt-0.5 flex-shrink-0">
                  {index + 1}.
                </span>
                <span>{recommendation}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 italic">
            No additional actions recommended at this time.
          </p>
        )}
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between pt-2 text-xs text-gray-500">
        <span>Score calculated in real-time</span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          Ready for action
        </span>
      </div>
    </div>
  );
}
