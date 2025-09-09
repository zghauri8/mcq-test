"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Question {
  question?: string;
  question_no?: number;
  options: Array<{
    score: number;
    text: string;
  }>;
}

interface TestData {
  questions: Question[];
}

function TestTakeContent() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "1234";
  const documentId = searchParams.get("documentId") || "demo123";

  const [testData, setTestData] = useState<TestData | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitResult, setSubmitResult] = useState<null | {
    success: boolean;
    message?: string;
  }>(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);

    try {
      console.log(`Fetching questions for userId: ${userId}`);
      // Use CORS proxy for the API call
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        `http://72.60.41.227:5000/get_mcqs/${userId}`
      )}`;
      console.log("🌐 Using CORS proxy for get_mcqs:", proxyUrl);

      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`API Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);

        // Handle the API response structure - it's an array of tests
        if (Array.isArray(data) && data.length > 0) {
          // Take the first test and use its questions
          const firstTest = data[0];
          console.log("First test data:", firstTest);
          setTestData({
            questions: firstTest.questions || [],
          });
          setLoading(false);
          return; // Exit early if API call succeeded
        } else {
          // Fallback if structure is different
          setTestData(data);
          setLoading(false);
          return; // Exit early if API call succeeded
        }
      } else {
        console.warn(
          `API returned ${response.status} - falling back to demo mode`
        );
        // Fall through to demo mode
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
      console.log(
        "🌐 API unavailable - running in Demo Mode with sample questions"
      );
    }

    // Only reach here if API failed - set demo mode and load mock data
    setIsDemoMode(true);
    const mockData = {
      questions: [
        {
          question: "I feel confident expressing my ideas in a group setting.",
          question_no: 1,
          options: [
            { score: 5, text: "Strongly Agree" },
            { score: 4, text: "Agree" },
            { score: 3, text: "Neutral" },
            { score: 2, text: "Disagree" },
            { score: 1, text: "Strongly Disagree" },
          ],
        },
        {
          question: "I enjoy working with others to solve complex problems.",
          question_no: 2,
          options: [
            { score: 5, text: "Strongly Agree" },
            { score: 4, text: "Agree" },
            { score: 3, text: "Neutral" },
            { score: 2, text: "Disagree" },
            { score: 1, text: "Strongly Disagree" },
          ],
        },
        {
          question: "I can easily adapt to new situations and challenges.",
          question_no: 3,
          options: [
            { score: 5, text: "Strongly Agree" },
            { score: 4, text: "Agree" },
            { score: 3, text: "Neutral" },
            { score: 2, text: "Disagree" },
            { score: 1, text: "Strongly Disagree" },
          ],
        },
        {
          question: "I am comfortable taking initiative in team projects.",
          question_no: 4,
          options: [
            { score: 5, text: "Strongly Agree" },
            { score: 4, text: "Agree" },
            { score: 3, text: "Neutral" },
            { score: 2, text: "Disagree" },
            { score: 1, text: "Strongly Disagree" },
          ],
        },
        {
          question: "I prefer to work independently rather than in groups.",
          question_no: 5,
          options: [
            { score: 1, text: "Strongly Agree" },
            { score: 2, text: "Agree" },
            { score: 3, text: "Neutral" },
            { score: 4, text: "Disagree" },
            { score: 5, text: "Strongly Disagree" },
          ],
        },
      ],
    };
    setTestData(mockData);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex.toString()]: answer,
    }));
  };

  const submitAnswers = async () => {
    setSubmitting(true);
    setSubmitResult(null);

    try {
      // Use CORS proxy for submit answers API
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
        "http://72.60.41.227:5000/submit_answers"
      )}`;
      console.log("🌐 Using CORS proxy for submit_answers:", proxyUrl);

      const response = await fetch(proxyUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          answers: answers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Submit answers API response:", data);

        // Store the results in localStorage for the results page
        localStorage.setItem(`testResults_${userId}`, JSON.stringify(data));

        setSubmitResult({
          success: true,
          message: data.message || "Answers submitted successfully!",
        });

        // Redirect to results page after 2 seconds
        setTimeout(() => {
          window.location.href = `/test-results?userId=${userId}`;
        }, 2000);
      } else {
        throw new Error(`API Error: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to submit answers:", error);

      // Store mock results in localStorage for demo mode
      const mockResults = {
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
          "Great job! You show strong communication and excellent problem-solving skills. (Demo Mode)",
      };
      localStorage.setItem(
        `testResults_${userId}`,
        JSON.stringify(mockResults)
      );

      setSubmitResult({
        success: true,
        message: "Answers submitted successfully! (Demo Mode)",
      });

      // Redirect to results page after 2 seconds even in demo mode
      setTimeout(() => {
        window.location.href = `/test-results?userId=${userId}`;
      }, 2000);
    } finally {
      setSubmitting(false);
    }
  };

  const isAllAnswered = () => {
    if (!testData || !testData.questions) return false;
    return testData.questions.every((_, index) => answers[index.toString()]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Loading Test Questions
            </h2>
            <p className="text-gray-600 mb-4">
              Fetching your personalized questions from the API...
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <p>• Connecting to assessment server</p>
              <p>• Retrieving question bank</p>
              <p>• Preparing your test</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center mb-3">
                  <Image
                    src="/site-logo.png"
                    alt="Candidate Finder Logo"
                    width={48}
                    height={48}
                    className="h-12 w-auto mr-4"
                  />
                  <div className="flex flex-col mr-4">
                    <span className="text-sm text-blue-500 font-medium leading-none">
                      CANDIDATE FINDER
                    </span>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      📝 Take Test
                    </h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    User ID:{" "}
                    <span className="font-semibold ml-1">{userId}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Document ID:{" "}
                    <span className="font-semibold ml-1">{documentId}</span>
                  </div>
                  {isDemoMode && (
                    <div className="flex items-center">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                      <span className="text-yellow-600 font-semibold">
                        Demo Mode
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Link
                href="/test-generate"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                ← Back to Generate
              </Link>
            </div>
          </div>

          {testData && testData.questions && (
            <div className="space-y-8">
              {testData.questions.map((question, questionIndex) => (
                <div
                  key={questionIndex}
                  className="bg-gradient-to-r from-white to-blue-50 border border-blue-200 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                        {question.question_no || questionIndex + 1}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        Question {question.question_no || questionIndex + 1}
                      </h3>
                    </div>
                    <p className="text-lg text-gray-700 leading-relaxed pl-14">
                      {question.question || "Please select your response:"}
                    </p>
                  </div>

                  <div className="space-y-3 pl-14">
                    {question.options.map((option, optionIndex) => (
                      <label
                        key={optionIndex}
                        className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                          answers[questionIndex.toString()] === option.text
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-25"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${questionIndex}`}
                          value={option.text}
                          checked={
                            answers[questionIndex.toString()] === option.text
                          }
                          onChange={(e) =>
                            handleAnswerChange(questionIndex, e.target.value)
                          }
                          className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <div className="ml-4 flex-1">
                          <span className="text-gray-800 font-medium">
                            {option.text}
                          </span>
                          <span className="ml-2 text-sm text-gray-500">
                            (Score: {option.score})
                          </span>
                        </div>
                        {answers[questionIndex.toString()] === option.text && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="mt-12 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {Object.keys(answers).length}
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-lg font-semibold text-gray-800">
                          Progress
                        </p>
                        <p className="text-sm text-gray-600">
                          {Object.keys(answers).length} of{" "}
                          {testData.questions.length} questions answered
                        </p>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (Object.keys(answers).length /
                              testData.questions.length) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <button
                    onClick={submitAnswers}
                    disabled={!isAllAnswered() || submitting}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl hover:from-green-600 hover:to-blue-600 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Submitting...
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
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Submit Answers
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {submitResult && (
            <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg">
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
                    🎉 Answers Submitted Successfully!
                  </h3>
                  <div className="text-lg text-green-700">
                    <p className="font-medium">{submitResult.message}</p>
                    <p className="text-sm text-green-600 mt-2">
                      Your responses have been recorded and will be processed
                      shortly.
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

export default function TestTakePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Loading Test...
            </h2>
            <p className="text-gray-600">
              Please wait while we load your test.
            </p>
          </div>
        </div>
      }
    >
      <TestTakeContent />
    </Suspense>
  );
}
