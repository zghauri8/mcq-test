"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface TestResults {
  analysis: Record<string, string>;
  max_score: number;
  percentage: number;
  total_score: number;
  trait_scores: Record<
    string,
    {
      score: number;
      max_score: number;
      percentage: number;
    }
  >;
  message?: string;
}

function TestResultsContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "123456";
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Just use mock data like the working pages
    const mockResults: TestResults = {
      analysis: {
        Communication: "Strong",
        Leadership: "Moderate",
        "Problem Solving": "Excellent",
        Teamwork: "Good",
      },
      max_score: 100,
      percentage: 85,
      total_score: 85,
      trait_scores: {
        Communication: {
          score: 22,
          max_score: 25,
          percentage: 88,
        },
        Leadership: {
          score: 18,
          max_score: 25,
          percentage: 72,
        },
        "Problem Solving": {
          score: 24,
          max_score: 25,
          percentage: 96,
        },
        Teamwork: {
          score: 21,
          max_score: 25,
          percentage: 84,
        },
      },
      message:
        "Great job! You show strong communication and excellent problem-solving skills.",
    };

    console.log("✅ Results data loaded:", mockResults);
    setResults(mockResults);
    setLoading(false);
  }, [userId]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getScoreEmoji = (percentage: number) => {
    if (percentage >= 90) return "🏆";
    if (percentage >= 80) return "🥇";
    if (percentage >= 70) return "🥈";
    if (percentage >= 60) return "🥉";
    return "📊";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Analyzing Your Results
            </h2>
            <p className="text-gray-600 mb-4">
              Processing your responses and generating insights...
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Calculating trait scores</p>
              <p>• Generating analysis</p>
              <p>• Preparing recommendations</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .fade-in {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {/* Professional header background */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Assessment Results
                </h1>
                <p className="text-gray-600 mt-1">Candidate ID: {userId}</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Completed</span>
                </div>
                <Link
                  href="/test-generate"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Overall Score Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
            <div className="p-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                  Overall Assessment Score
                </h2>

                {/* Professional Score Display */}
                <div className="flex items-center justify-center mb-8">
                  <div className="relative w-32 h-32">
                    <svg
                      className="w-32 h-32 transform -rotate-90"
                      viewBox="0 0 100 100"
                    >
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        stroke="#3b82f6"
                        strokeWidth="8"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 40}`}
                        strokeDashoffset={`${
                          2 *
                          Math.PI *
                          40 *
                          (1 - (results?.percentage || 0) / 100)
                        }`}
                        className="transition-all duration-1000 ease-out"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {results?.percentage || 0}%
                      </span>
                      <span className="text-sm text-gray-500">
                        {results?.total_score || 0}/{results?.max_score || 0}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="max-w-2xl mx-auto">
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    {results?.message || "Assessment completed"}
                  </h3>
                  <p className="text-gray-600">
                    Based on comprehensive evaluation across multiple competency
                    areas
                  </p>
                </div>
              </div>
            </div>
          </div>

          {results && (
            <div className="space-y-8">
              {/* Competency Analysis */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Competency Analysis
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Detailed breakdown by competency area
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Object.entries(results.trait_scores).map(
                      ([trait, data], index) => (
                        <div
                          key={trait}
                          className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-medium text-gray-900">
                              {trait}
                            </h4>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-gray-900">
                                {data.percentage}%
                              </div>
                              <div className="text-sm text-gray-500">
                                {data.score}/{data.max_score} points
                              </div>
                            </div>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                data.percentage >= 80
                                  ? "bg-green-500"
                                  : data.percentage >= 60
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${data.percentage}%` }}
                            ></div>
                          </div>

                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Assessment:</span>{" "}
                            {results.analysis[trait]}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Performance Summary - Outlook Style */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Performance Summary
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Key strengths and development areas
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Strengths
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {Object.entries(results.analysis)
                          .filter(
                            ([_, level]) =>
                              level === "Excellent" || level === "Strong"
                          )
                          .map(([trait, level]) => (
                            <li
                              key={trait}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <span className="text-gray-900 font-medium">
                                  {trait}
                                </span>
                                <span className="text-green-600 font-semibold ml-2">
                                  ({level})
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-yellow-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                        </div>
                        <h4 className="text-lg font-semibold text-gray-900">
                          Development Areas
                        </h4>
                      </div>
                      <ul className="space-y-3">
                        {Object.entries(results.analysis)
                          .filter(
                            ([_, level]) =>
                              level === "Moderate" || level === "Weak"
                          )
                          .map(([trait, level]) => (
                            <li
                              key={trait}
                              className="flex items-start space-x-3"
                            >
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <span className="text-gray-900 font-medium">
                                  {trait}
                                </span>
                                <span className="text-yellow-600 font-semibold ml-2">
                                  ({level})
                                </span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Professional Style */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href="/test-generate"
                      className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Take Another Assessment
                    </Link>
                    <button
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                    >
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                        />
                      </svg>
                      Print Results
                    </button>
                  </div>

                  {/* Professional completion message */}
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-600">
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="text-sm font-medium">
                        Assessment completed successfully
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function TestResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Results...
            </h2>
            <p className="text-gray-600">
              Please wait while we load your test results.
            </p>
          </div>
        </div>
      }
    >
      <TestResultsContent />
    </Suspense>
  );
}
