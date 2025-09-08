"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface DashboardStats {
  totalJobs: number;
  totalCandidates: number;
  totalApplications: number;
  totalInterviews: number;
  totalHired: number;
  totalRejected: number;
}

interface JobStatus {
  id: string;
  job: string;
  department: string;
  candidates: number;
  status: {
    applied: number;
    interviewed: number;
    rejected: number;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{
    first_name?: string;
    last_name?: string;
    email?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalJobs: 12,
    totalCandidates: 12,
    totalApplications: 14,
    totalInterviews: 14,
    totalHired: 0,
    totalRejected: 0,
  });

  const [jobStatuses] = useState<JobStatus[]>([
    {
      id: "1",
      job: "Marketing Executive",
      department: "Marketing",
      candidates: 12,
      status: { applied: 0, interviewed: 0, rejected: 0 },
    },
    {
      id: "2",
      job: "Accounts Manager",
      department: "Accounting",
      candidates: 0,
      status: { applied: 0, interviewed: 0, rejected: 0 },
    },
    {
      id: "3",
      job: "Computer System Analyst",
      department: "Information Technology",
      candidates: 2,
      status: { applied: 0, interviewed: 0, rejected: 0 },
    },
    {
      id: "4",
      job: "Network Administrator",
      department: "Information Technology",
      candidates: 0,
      status: { applied: 0, interviewed: 0, rejected: 0 },
    },
    {
      id: "5",
      job: "Project Manager",
      department: "Administration",
      candidates: 0,
      status: { applied: 0, interviewed: 0, rejected: 0 },
    },
  ]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/v1/candidates/me", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.removeItem("token");
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold">
              JF
            </div>
            <h1 className="ml-3 text-xl font-bold">JOB FINDER</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-6">
            {/* Dashboard */}
            <div>
              <Link
                href="/dashboard"
                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                Dashboard
              </Link>
            </div>

            {/* Job Management */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                JOB MANAGEMENT
              </h3>
              <div className="space-y-1">
                <Link
                  href="/jobs"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                  Job Board
                </Link>
                <Link
                  href="/interviews"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Interviews
                </Link>
                <Link
                  href="/jobs"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                  Jobs
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Users Management */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                USERS MANAGEMENT
              </h3>
              <div className="space-y-1">
                <Link
                  href="/team"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                  </svg>
                  Team
                </Link>
                <Link
                  href="/candidates"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                  Candidates
                </Link>
              </div>
            </div>

            {/* Others */}
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                OTHERS
              </h3>
              <div className="space-y-1">
                <Link
                  href="/blogs"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Blogs
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Settings
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user?.first_name?.[0] || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">
                {user?.first_name || "User"}
              </p>
              <p className="text-xs text-gray-400">{user?.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="ml-auto p-1 text-gray-400 hover:text-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-6 h-6 text-gray-600 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"
                  />
                </svg>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <svg
                  className="w-6 h-6"
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
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
            {/* All Jobs */}
            <div className="bg-blue-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">All Jobs</p>
                  <p className="text-3xl font-bold">{stats.totalJobs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"
                    />
                  </svg>
                </div>
              </div>
              <button className="mt-4 text-blue-100 text-sm hover:text-white">
                View all →
              </button>
            </div>

            {/* Total Candidates */}
            <div className="bg-orange-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">
                    Total Candidates
                  </p>
                  <p className="text-3xl font-bold">{stats.totalCandidates}</p>
                </div>
                <div className="w-12 h-12 bg-orange-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l9-5-9-5-9 5 9 5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    />
                  </svg>
                </div>
              </div>
              <button className="mt-4 text-orange-100 text-sm hover:text-white">
                More info →
              </button>
            </div>

            {/* Total Applications */}
            <div className="bg-blue-600 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Applications
                  </p>
                  <p className="text-3xl font-bold">
                    {stats.totalApplications}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                    />
                  </svg>
                </div>
              </div>
              <button className="mt-4 text-blue-100 text-sm hover:text-white">
                More info →
              </button>
            </div>

            {/* Total Interviews */}
            <div className="bg-pink-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium">
                    Total Interviews
                  </p>
                  <p className="text-3xl font-bold">{stats.totalInterviews}</p>
                </div>
                <div className="w-12 h-12 bg-pink-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
                </div>
              </div>
              <button className="mt-4 text-pink-100 text-sm hover:text-white">
                More info →
              </button>
            </div>

            {/* Total Hired */}
            <div className="bg-green-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">
                    Total Hired
                  </p>
                  <p className="text-3xl font-bold">{stats.totalHired}</p>
                </div>
                <div className="w-12 h-12 bg-green-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
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
              </div>
              <button className="mt-4 text-green-100 text-sm hover:text-white">
                More info →
              </button>
            </div>

            {/* Total Rejected */}
            <div className="bg-red-500 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium">
                    Total Rejected
                  </p>
                  <p className="text-3xl font-bold">{stats.totalRejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-400 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <button className="mt-4 text-red-100 text-sm hover:text-white">
                More info →
              </button>
            </div>
          </div>

          {/* Charts and Tables Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Popular Jobs Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Popular Jobs
                </h3>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Applied</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Favorited</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <span className="text-sm text-gray-600">Referred</span>
                  </label>
                </div>
              </div>

              {/* Donut Chart Placeholder */}
              <div className="flex items-center justify-center h-64">
                <div className="relative">
                  <div className="w-48 h-48 rounded-full border-8 border-blue-500 border-t-green-500 border-r-red-500"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-lg font-semibold text-gray-900">
                      Marketing Executive
                    </p>
                    <p className="text-3xl font-bold text-gray-900">12</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Candidates Chart */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Top Candidates
                </h3>
                <div className="flex items-center space-x-4">
                  <div className="flex space-x-2">
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-1" />
                      <span className="text-sm text-gray-600">Traits</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-1" />
                      <span className="text-sm text-gray-600">Interviews</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" defaultChecked className="mr-1" />
                      <span className="text-sm text-gray-600">Quizes</span>
                    </label>
                  </div>
                  <select className="text-sm border border-gray-300 rounded px-2 py-1">
                    <option>All Jobs</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Result
                </h4>
              </div>

              {/* Bar Chart Placeholder */}
              <div className="space-y-3">
                {[
                  { name: "Neil Armstrong", score: 115, width: "95%" },
                  { name: "Brad Pitt", score: 90, width: "75%" },
                  { name: "Victoria Joseph", score: 70, width: "58%" },
                  { name: "Ali Moeen", score: 65, width: "54%" },
                  { name: "Mahima Khan", score: 45, width: "37%" },
                ].map((candidate, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-24 text-sm text-gray-600 truncate">
                      {candidate.name}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                          className="bg-blue-500 h-4 rounded-full"
                          style={{ width: candidate.width }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-12 text-sm text-gray-600 text-right">
                      {candidate.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Job Statuses Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Job Statuses
                </h3>
                <div className="flex items-center text-sm text-gray-500">
                  <button className="p-1 hover:bg-gray-100 rounded">‹</button>
                  <span className="mx-2">1 - 5 of 12</span>
                  <button className="p-1 hover:bg-gray-100 rounded">›</button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Candidates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobStatuses.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <a
                            href="#"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            {job.job}
                          </a>
                          <svg
                            className="w-4 h-4 ml-1 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.department}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {job.candidates}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                            <span className="text-sm text-gray-600">0</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                            <span className="text-sm text-gray-600">0</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                            <span className="text-sm text-gray-600">0</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* To Do List */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  To Do List
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    <svg
                      className="w-5 h-5"
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
                  </button>
                  <div className="flex items-center text-sm text-gray-500">
                    <button className="p-1 hover:bg-gray-100 rounded">‹</button>
                    <span className="mx-2">1 - 0 of 0</span>
                    <button className="p-1 hover:bg-gray-100 rounded">›</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 text-center text-gray-500">
              <p>No tasks yet. Add your first task!</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
