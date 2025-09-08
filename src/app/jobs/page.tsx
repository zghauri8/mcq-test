"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Job {
  id: number;
  title: string;
  description: string;
  requirements: string;
  employment_type: string;
  experience_level: string;
  location: string;
  is_remote: boolean;
  salary_range_min?: number;
  salary_range_max?: number;
  salary_currency: string;
  created_at: string;
  company: {
    id: number;
    name: string;
    logo?: string;
    industry?: string;
  };
  category?: {
    id: number;
    name: string;
  };
  skills: Array<{
    id: number;
    name: string;
  }>;
}

interface JobFilters {
  search: string;
  category: string;
  location: string;
  employment_type: string;
  experience_level: string;
  is_remote: string;
  salary_min: string;
  salary_max: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JobFilters>({
    search: "",
    category: "",
    location: "",
    employment_type: "",
    experience_level: "",
    is_remote: "",
    salary_min: "",
    salary_max: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchJobs = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: "10",
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await fetch(
        `http://localhost:3001/api/jobs?${queryParams}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const data = await response.json();
      setJobs(data.jobs);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handlePageChange = (page: number) => {
    fetchJobs(page);
  };

  const formatSalary = (min?: number, max?: number, currency = "USD") => {
    if (!min && !max) return "Salary not specified";
    if (min && max)
      return `${currency} ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `${currency} ${min.toLocaleString()}+`;
    if (max) return `Up to ${currency} ${max.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find Your Dream Job
          </h1>
          <p className="text-gray-600">
            Discover thousands of job opportunities from top companies
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Location */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City, state, or country"
                  value={filters.location}
                  onChange={(e) =>
                    handleFilterChange("location", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Employment Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={filters.employment_type}
                  onChange={(e) =>
                    handleFilterChange("employment_type", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="temporary">Temporary</option>
                  <option value="internship">Internship</option>
                  <option value="volunteer">Volunteer</option>
                </select>
              </div>

              {/* Experience Level */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  value={filters.experience_level}
                  onChange={(e) =>
                    handleFilterChange("experience_level", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Levels</option>
                  <option value="internship">Internship</option>
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead</option>
                  <option value="executive">Executive</option>
                </select>
              </div>

              {/* Remote Work */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Remote Work
                </label>
                <select
                  value={filters.is_remote}
                  onChange={(e) =>
                    handleFilterChange("is_remote", e.target.value)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Remote Only</option>
                  <option value="false">On-site Only</option>
                </select>
              </div>

              {/* Salary Range */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Salary Range
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.salary_min}
                    onChange={(e) =>
                      handleFilterChange("salary_min", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.salary_max}
                    onChange={(e) =>
                      handleFilterChange("salary_max", e.target.value)
                    }
                    className="w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Jobs List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <p className="text-red-800">{error}</p>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or check back later for new
                  opportunities.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-600">
                    Showing {jobs.length} of {pagination.totalItems} jobs
                  </p>
                </div>

                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <Link
                            href={`/jobs/${job.id}`}
                            className="text-xl font-semibold text-blue-600 hover:text-blue-800"
                          >
                            {job.title}
                          </Link>
                          <p className="text-gray-600 mt-1">
                            {job.company.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {formatDate(job.created_at)}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-gray-700 line-clamp-2">
                          {job.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {job.employment_type.replace("-", " ")}
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {job.experience_level.replace("-", " ")}
                        </span>
                        {job.is_remote && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                            Remote
                          </span>
                        )}
                        {job.category && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                            {job.category.name}
                          </span>
                        )}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm text-gray-600">
                          <svg
                            className="w-4 h-4 mr-1"
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
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {formatSalary(
                            job.salary_range_min,
                            job.salary_range_max,
                            job.salary_currency
                          )}
                        </div>
                      </div>

                      {job.skills && job.skills.length > 0 && (
                        <div className="mt-4">
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 5).map((skill) => (
                              <span
                                key={skill.id}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                              >
                                {skill.name}
                              </span>
                            ))}
                            {job.skills.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                +{job.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex space-x-2">
                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage - 1)
                        }
                        disabled={pagination.currentPage === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            page === pagination.currentPage
                              ? "bg-blue-600 text-white"
                              : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          handlePageChange(pagination.currentPage + 1)
                        }
                        disabled={
                          pagination.currentPage === pagination.totalPages
                        }
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}







