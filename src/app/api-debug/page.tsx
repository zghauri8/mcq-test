"use client";

import { useState } from "react";

interface ApiTestResult {
  name: string;
  url: string;
  method: string;
  status: number | string;
  statusText: string;
  success: boolean;
  contentType: string | null;
  data: unknown;
  error: string | null;
  rawResponse: string | null;
}

export default function ApiDebugPage() {
  const [results, setResults] = useState<ApiTestResult[]>([]);
  const [loading, setLoading] = useState(false);

  const testAllApis = async () => {
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
        name: "Get MCQs API",
        method: "GET",
        url: `${baseUrl}/get_mcqs/123456`,
        body: null,
      },
      {
        name: "Submit Answers API",
        method: "POST",
        url: `${baseUrl}/submit_answers`,
        body: {
          user_id: "123456",
          answers: {
            "1": "Strongly Agree",
            "2": "Agree",
            "3": "Neutral",
          },
        },
      },
      {
        name: "Get Results API",
        method: "GET",
        url: `${baseUrl}/get_results/123456`,
        body: null,
      },
    ];

    const testResults = [];

    for (const testCase of testCases) {
      try {
        console.log(`\n🚀 Testing: ${testCase.name}`);
        console.log(`📡 URL: ${testCase.url}`);
        console.log(`📋 Method: ${testCase.method}`);
        if (testCase.body) {
          console.log(`📦 Body:`, testCase.body);
        }

        // Try direct API call first
        const response = await fetch(testCase.url, {
          method: testCase.method,
          headers: {
            "Content-Type": "application/json",
          },
          body: testCase.body ? JSON.stringify(testCase.body) : undefined,
        });

        console.log(`📊 Response Status: ${response.status}`);
        console.log(`📊 Response OK: ${response.ok}`);
        console.log(`📋 Content-Type: ${response.headers.get("content-type")}`);

        const result: ApiTestResult = {
          name: testCase.name,
          url: testCase.url,
          method: testCase.method,
          status: response.status,
          statusText: response.statusText,
          success: response.ok,
          contentType: response.headers.get("content-type"),
          data: null,
          error: null,
          rawResponse: null,
        };

        if (response.ok) {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            result.data = await response.json();
            console.log(`✅ JSON Data:`, result.data);
          } else {
            result.rawResponse = await response.text();
            console.log(
              `⚠️ Non-JSON Response:`,
              result.rawResponse.substring(0, 500)
            );
          }
        } else {
          result.rawResponse = await response.text();
          console.log(
            `❌ Error Response:`,
            result.rawResponse.substring(0, 500)
          );
        }

        testResults.push(result);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        console.error(`❌ ${testCase.name} failed:`, error);
        testResults.push({
          name: testCase.name,
          url: testCase.url,
          method: testCase.method,
          status: "ERROR",
          statusText: "Network Error",
          success: false,
          contentType: null,
          data: null,
          error: error.message,
          rawResponse: null,
        });
      }
    }

    setResults(testResults);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            🔍 API Debug Console
          </h1>

          <div className="mb-6">
            <button
              onClick={testAllApis}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? "Testing APIs..." : "Test All APIs"}
            </button>
          </div>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  result.success
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{result.name}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.success
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.success ? "SUCCESS" : "FAILED"}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-1">
                  <p>
                    <strong>URL:</strong> {result.url}
                  </p>
                  <p>
                    <strong>Method:</strong> {result.method}
                  </p>
                  <p>
                    <strong>Status:</strong> {result.status} {result.statusText}
                  </p>
                  <p>
                    <strong>Content-Type:</strong> {result.contentType || "N/A"}
                  </p>

                  {result.data != null && (
                    <div>
                      <p>
                        <strong>JSON Data:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  {result.rawResponse && (
                    <div>
                      <p>
                        <strong>Raw Response:</strong>
                      </p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto max-h-32">
                        {result.rawResponse.substring(0, 1000)}
                        {result.rawResponse.length > 1000 && "..."}
                      </pre>
                    </div>
                  )}

                  {result.error && (
                    <p className="text-red-600">
                      <strong>Error:</strong> {result.error}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              📋 Instructions
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Click &quot;Test All APIs&quot; to test all endpoints</li>
              <li>• Check the browser console for detailed logs</li>
              <li>• Green = API returned valid JSON</li>
              <li>• Red = API failed or returned HTML/error</li>
              <li>• This will show you exactly what each API returns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
