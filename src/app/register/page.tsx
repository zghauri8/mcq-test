"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "Zohaib",
    last_name: "Ghauri",
    gender: "male",
    email: "zohaibapkabaap@gmail.com",
    password: "",
    retype_password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.retype_password) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/candidates/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store the token in localStorage
      if (data.token) {
        localStorage.setItem("token", data.token);
        router.push("/account");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Intro Section */}
      <section id="intro" className="clearfix front-intro-section">
        <div className="container">
          <div className="intro-img"></div>
          <div className="intro-info">
            <h2>
              <span>Register</span>
            </h2>
          </div>
        </div>
      </section>

      <main id="main">
        {/* Account Area Section */}
        <section className="main-container">
          <div className="container">
            <div className="row mt-10">
              <div className="col-lg-2"></div>
              <div className="col-md-8 col-lg-8 col-sm-12">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-sm-12">
                    <div className="account-box">
                      <p className="account-box-heading">
                        <span className="account-box-heading-text">
                          Register
                        </span>
                        <span className="account-box-heading-line"></span>
                      </p>

                      <div className="container">
                        <form className="form" onSubmit={handleSubmit}>
                          {error && (
                            <div className="alert alert-danger" role="alert">
                              {error}
                            </div>
                          )}
                          <div className="row">
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="first_name">First Name</label>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    name="first_name"
                                    className="form-control"
                                    placeholder="First Name"
                                    aria-label="First Name"
                                    aria-describedby="basic-addon1"
                                    value={formData.first_name}
                                    onChange={handleChange}
                                    required
                                  />
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-user"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Enter first name
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="last_name">Last Name</label>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    name="last_name"
                                    className="form-control"
                                    placeholder="Last Name"
                                    aria-label="Last Name"
                                    aria-describedby="basic-addon1"
                                    value={formData.last_name}
                                    onChange={handleChange}
                                    required
                                  />
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-user"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Enter last name
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="gender">Gender</label>
                                <div className="input-group mb-3">
                                  <select
                                    name="gender"
                                    className="form-control"
                                    value={formData.gender}
                                    onChange={handleChange}
                                  >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                  </select>
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-user"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Select gender
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="email">Email</label>
                                <div className="input-group mb-3">
                                  <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    placeholder="Email"
                                    aria-label="Email"
                                    aria-describedby="basic-addon1"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                  />
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-envelope"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Enter email
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="password">Password</label>
                                <div className="input-group mb-3">
                                  <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Password"
                                    aria-label="Password"
                                    aria-describedby="basic-addon1"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                  />
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-key"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Enter password
                                </small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="retype_password">
                                  Retype Password
                                </label>
                                <div className="input-group mb-3">
                                  <input
                                    type="password"
                                    name="retype_password"
                                    className="form-control"
                                    placeholder="Password"
                                    aria-label="Retype Password"
                                    aria-describedby="basic-addon1"
                                    value={formData.retype_password}
                                    onChange={handleChange}
                                    required
                                  />
                                  <div className="input-group-prepend">
                                    <span
                                      className="input-group-text"
                                      id="basic-addon1"
                                    >
                                      <i className="fa fa-key"></i>
                                    </span>
                                  </div>
                                </div>
                                <small className="form-text text-muted">
                                  Enter password again
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-12 col-lg-12">
                              <div className="form-group form-group-account">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                  title="Save"
                                  disabled={loading}
                                >
                                  {loading ? "Creating Account..." : "Register"}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>

                      <div className="container">
                        <div className="row">
                          <div className="col-md-12 col-lg-12">
                            <div className="form-group form-group-account">
                              <a href="/login">Back to Login</a>
                              <br />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-2"></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
