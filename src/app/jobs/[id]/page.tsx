"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  responsibilities?: string;
  employment_type: string;
  experience_level: string;
  education_level?: string;
  location: string;
  is_remote: boolean;
  salary_range_min?: number;
  salary_range_max?: number;
  salary_currency: string;
  salary_type: string;
  apply_url?: string;
  created_at: string;
  company: {
    id: number;
    name: string;
    logo?: string;
    industry?: string;
    website?: string;
    description?: string;
  };
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  skills: Array<{
    id: number;
    name: string;
    category?: string;
  }>;
  creator: {
    id: number;
    first_name: string;
    last_name: string;
  };
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationData, setApplicationData] = useState({
    cover_letter: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `http://localhost:3001/api/jobs/${params.id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found");
          }
          throw new Error("Failed to fetch job details");
        }

        const data = await response.json();
        setJob(data.job);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchJob();
    }
  }, [params.id]);

  const handleApply = async () => {
    try {
      setApplying(true);

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const response = await fetch(`http://localhost:3001/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          job_id: job?.id,
          cover_letter: applicationData.cover_letter,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit application");
      }

      alert("Application submitted successfully!");
      router.push("/dashboard");
    } catch (err) {
      alert(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (
    min?: number,
    max?: number,
    currency = "USD",
    type = "yearly"
  ) => {
    if (!min && !max) return "Salary not specified";

    const formatAmount = (amount: number) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    if (min && max) {
      return `${formatAmount(min)} - ${formatAmount(max)} per ${type}`;
    }
    if (min) {
      return `${formatAmount(min)}+ per ${type}`;
    }
    if (max) {
      return `Up to ${formatAmount(max)} per ${type}`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Job not found"}
          </h1>
          <Link
            href="/jobs"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/jobs"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                ← Back to Jobs
              </Link>
            </div>
            <div className="text-sm text-gray-500">
              Posted on {formatDate(job.created_at)}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-sm p-8">
              {/* Job Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {job.title}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {job.company.name}
                    </h2>
                    {job.company.industry && (
                      <p className="text-gray-600">{job.company.industry}</p>
                    )}
                  </div>
                  {job.company.logo && (
                    <img
                      src={job.company.logo}
                      alt={`${job.company.name} logo`}
                      className="w-16 h-16 object-contain"
                    />
                  )}
                </div>

                {/* Job Meta */}
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center text-gray-600">
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
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {job.location || "Location not specified"}
                    {job.is_remote && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                        Remote
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-gray-600">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {job.employment_type.replace("-", " ")}
                  </div>

                  <div className="flex items-center text-gray-600">
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {job.experience_level.replace("-", " ")}
                  </div>
                </div>

                {/* Salary */}
                <div className="mb-6">
                  <p className="text-lg font-semibold text-gray-900">
                    {formatSalary(
                      job.salary_range_min,
                      job.salary_range_max,
                      job.salary_currency,
                      job.salary_type
                    )}
                  </p>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Job Description
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {job.description}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Requirements
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {job.requirements}
                  </p>
                </div>
              </div>

              {/* Responsibilities */}
              {job.responsibilities && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Responsibilities
                  </h3>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {job.responsibilities}
                    </p>
                  </div>
                </div>
              )}

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-1/3">
            {/* Apply Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Apply for this position
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter
                </label>
                <textarea
                  value={applicationData.cover_letter}
                  onChange={(e) =>
                    setApplicationData({
                      ...applicationData,
                      cover_letter: e.target.value,
                    })
                  }
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <button
                onClick={handleApply}
                disabled={applying}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {applying ? "Applying..." : "Apply Now"}
              </button>

              {job.apply_url && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Or apply directly:
                  </p>
                  <a
                    href={job.apply_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    Apply on Company Website
                  </a>
                </div>
              )}
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                About {job.company.name}
              </h3>

              {job.company.description && (
                <p className="text-gray-700 mb-4">{job.company.description}</p>
              )}

              <div className="space-y-2">
                {job.company.website && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Website:
                    </span>
                    <a
                      href={job.company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 text-blue-600 hover:text-blue-800 underline"
                    >
                      {job.company.website}
                    </a>
                  </div>
                )}

                {job.company.industry && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Industry:
                    </span>
                    <span className="ml-2 text-gray-700">
                      {job.company.industry}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4">
                <Link
                  href={`/jobs?company_id=${job.company.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  View all jobs from {job.company.name}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

