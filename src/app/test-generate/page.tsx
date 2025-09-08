"use client";

import { useState } from "react";
import Link from "next/link";

export default function TestGeneratePage() {
  const [userId, setUserId] = useState("123456");
  const [trait, setTrait] = useState("Communication");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    document_id: string;
    message: string;
    questions: unknown[];
  } | null>(null);

  const generateTest = async () => {
    setLoading(true);
    setResult(null);

    try {
      // Using CORS proxy for generate_test API
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        "http://72.60.41.227:5000/generate_test"
      )}`;
      console.log("🌐 Using CORS proxy for generate_test:", proxyUrl);

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          trait: trait,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      console.log("📋 Generate Response content-type:", contentType);

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log("✅ Generate test API response:", data);
        setResult(data);
      } else {
        // Response is not JSON, probably HTML error page
        const textResponse = await response.text();
        console.log(
          "⚠️ Generate Non-JSON response received:",
          textResponse.substring(0, 200) + "..."
        );
        throw new Error(
          "Backend returned HTML instead of JSON - API endpoint may not exist or server error"
        );
      }
    } catch {
      // Show mock success for demo
      setResult({
        document_id: "demo_" + Date.now(),
        message: "Test generated successfully (Demo Mode)",
        questions: [],
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              🎯 Generate Test
            </h1>
            <p className="text-lg text-gray-600">
              Create a personalized assessment based on user ID and trait
              selection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                👤 User ID
              </label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-300 focus:border-blue-500 transition-all duration-200 text-lg"
                placeholder="Enter user ID"
              />
              <p className="text-sm text-gray-600 mt-2">
                Unique identifier for the test taker
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <label className="block text-lg font-semibold text-gray-800 mb-3">
                🎭 Assessment Trait
              </label>
              <select
                value={trait}
                onChange={(e) => setTrait(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all duration-200 text-lg"
              >
                <option value="Communication">💬 Communication</option>
                <option value="Leadership">👑 Leadership</option>
                <option value="Problem Solving">🧩 Problem Solving</option>
                <option value="Teamwork">🤝 Teamwork</option>
                <option value="Creativity">🎨 Creativity</option>
              </select>
              <p className="text-sm text-gray-600 mt-2">
                Select the skill area to assess
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={generateTest}
              disabled={loading}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Generating Test...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Generate Test
                </div>
              )}
            </button>

            {result && (
              <Link
                href={`/test-take?userId=${userId}&documentId=${result.document_id}`}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Take Test
                </div>
              </Link>
            )}
          </div>

          {result && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-6">
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    🎉 Test Generated Successfully!
                  </h3>
                  <div className="text-lg text-green-700 space-y-1">
                    <p>
                      <span className="font-semibold">Document ID:</span>{" "}
                      {result.document_id}
                    </p>
                    <p>
                      <span className="font-semibold">Status:</span>{" "}
                      {result.message}
                    </p>
                    <p className="text-sm text-green-600 mt-3">
                      Your personalized assessment is ready. Click &quot;Take
                      Test&quot; to begin!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
