"use client";

import { useState } from "react";

interface ApiTestResult {
  name: string;
  url: string;
  method: string;
  status: number;
  statusText: string;
  success: boolean;
  data: unknown;
  error: string | null;
}

export default function ApiTestPage() {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const testEndpoints = async () => {
    setLoading(true);
    setResults([]);

    const baseUrl = "http://72.60.41.227:5000";
    const testCases = [
      {
        name: "Generate Test API",
        method: "POST",
        url: `${baseUrl}/generate_test`,
        body: {
          user_id: "123456",
          trait: "Communication",
        },
      },
      {
        name: "Get MCQs with Document ID",
        method: "GET",
        url: `${baseUrl}/get_mcqs/68bc0f5d81ce955f92f7c385`,
        body: null,
      },
      {
        name: "Get MCQs with User ID",
        method: "GET",
        url: `${baseUrl}/get_mcqs/123456`,
        body: null,
      },
      {
        name: "Get MCQs with Query Param",
        method: "GET",
        url: `${baseUrl}/get_mcqs?document_id=68bc0f5d81ce955f92f7c385`,
        body: null,
      },
      {
        name: "Submit Answers API",
        method: "POST",
        url: `${baseUrl}/submit_answers`,
        body: {
          user_id: "1234",
          answers: {
            "1": "Strongly Agree",
            "2": "Disagree",
            "3": "Neutral",
          },
        },
      },
      {
        name: "Get Results API",
        method: "GET",
        url: `${baseUrl}/get_results/1234`,
        body: null,
      },
    ];

    const testResults = [];

    for (const testCase of testCases) {
      try {
        console.log(`Testing: ${testCase.name}`);

        // Use CORS proxy for all API calls
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          testCase.url
        )}`;
        console.log(`🌐 Using CORS proxy: ${proxyUrl}`);

        const response = await fetch(proxyUrl, {
          method: testCase.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: testCase.body ? JSON.stringify(testCase.body) : undefined,
        });

        const result: ApiTestResult = {
          name: testCase.name,
          url: testCase.url,
          method: testCase.method,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          data: null,
          error: null,
        };

        if (response.ok) {
          try {
            result.data = await response.json();
          } catch {
            result.data = "Response is not JSON";
          }
        } else {
          result.error = `HTTP ${response.status}: ${response.statusText}`;
        }

        testResults.push(result);
      } catch (error) {
        testResults.push({
          name: testCase.name,
          url: testCase.url,
          method: testCase.method,
          status: 0,
          statusText: "Network Error",
          success: false,
          data: null,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              API Endpoint Tester
            </h1>
            <p className="text-gray-600">
              Test all API endpoints to identify working configurations
            </p>
          </div>

          <button
            onClick={testEndpoints}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {loading ? "Testing..." : "Test All Endpoints"}
          </button>

          {results.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Test Results
              </h2>
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.success
                      ? "border-green-200 bg-green-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {result.name}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${
                        result.success
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {result.success ? "SUCCESS" : "FAILED"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <strong>Method:</strong> {result.method} |{" "}
                    <strong>Status:</strong> {result.status} {result.statusText}
                  </div>

                  <div className="text-sm text-gray-600 mb-2">
                    <strong>URL:</strong> {result.url}
                  </div>

                  {result.error && (
                    <div className="text-sm text-red-600 mb-2">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}

                  {result.data != null && (
                    <div className="text-sm">
                      <strong>Response:</strong>
                      <pre className="mt-1 bg-white p-2 rounded border text-xs overflow-auto max-h-40">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              API Documentation
            </h2>
            <div className="bg-gray-100 rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Base URL:</strong> http://72.60.41.227:5000
                </div>
                <div>
                  <strong>Generate Test:</strong> POST /generate_test
                </div>
                <div>
                  <strong>Get Questions:</strong> GET /get_mcqs/{`{id}`}
                </div>
                <div>
                  <strong>Submit Answers:</strong> POST /submit_answers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
