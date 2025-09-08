'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone1: '',
    phone2: '',
    city: '',
    state: '',
    country: '',
    address: '',
    gender: 'male',
    dob: '',
    bio: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user data
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/candidates/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setFormData({
            first_name: userData.first_name || '',
            last_name: userData.last_name || '',
            email: userData.email || '',
            phone1: userData.phone1 || '',
            phone2: userData.phone2 || '',
            city: userData.city || '',
            state: userData.state || '',
            country: userData.country || '',
            address: userData.address || '',
            gender: userData.gender || 'male',
            dob: userData.dob || '',
            bio: userData.bio || '',
          });
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/candidates/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Profile updated successfully!');
        // Refresh user data
        const userData = await response.json();
        setUser(userData);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to update profile');
      }
    } catch (error) {
      setMessage('An error occurred while updating profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Intro Section */}
      <section id="intro" className="clearfix front-intro-section">
        <div className="container">
          <div className="intro-img"></div>
          <div className="intro-info">
            <h2><span>Account > Profile</span></h2>
          </div>
        </div>
      </section>

      <main id="main">
        {/* Account Area Section */}
        <section id="about">
          <div className="container">
            <div className="row mt-10">
              <div className="col-lg-3">
                <div className="account-area-left">
                  <ul>
                    <li>
                      <a href="/account/profile" className="active">
                        <i className="fa fa-user"></i> Profile
                      </a>
                    </li>
                    <li>
                      <a href="/account/resume">
                        <i className="fa fa-file"></i> My Resume
                      </a>
                    </li>
                    <li>
                      <a href="/account/job-applications">
                        <i className="fa fa-check"></i> Job Applications
                      </a>
                    </li>
                    <li>
                      <a href="/account/job-favorites">
                        <i className="fa fa-heart"></i> Job Favorites
                      </a>
                    </li>
                    <li>
                      <a href="/account/interviews">
                        <i className="fa fa-video"></i> Interviews
                      </a>
                    </li>
                    <li>
                      <a href="/account/quizzes">
                        <i className="fa fa-question-circle"></i> Quizzes
                      </a>
                    </li>
                    <li>
                      <a href="/account/password">
                        <i className="fa fa-key"></i> Change Password
                      </a>
                    </li>
                    <li>
                      <a href="#" onClick={() => {
                        localStorage.removeItem('token');
                        router.push('/');
                      }}>
                        <i className="fas fa-sign-out-alt"></i> Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-md-9 col-lg-9 col-sm-12">
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-sm-12">
                    <div className="account-box">
                      <p className="account-box-heading">
                        <span className="account-box-heading-text">Profile</span>
                        <span className="account-box-heading-line"></span>
                      </p>
                      
                      <div className="container">
                        <form className="form" onSubmit={handleSubmit}>
                          {message && (
                            <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'}`} role="alert">
                              {message}
                            </div>
                          )}
                          <div className="row">
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="first_name">First Name</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Adam" 
                                  name="first_name" 
                                  value={formData.first_name}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter first name</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="phone1">Phone 1</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="12345 67891011" 
                                  name="phone1" 
                                  value={formData.phone1}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter phone 1.</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="city">City</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="New York" 
                                  name="city" 
                                  value={formData.city}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter city</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="country">Country</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Australia" 
                                  name="country" 
                                  value={formData.country}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter country</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="gender">Gender</label>
                                <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                                  <option value="male">Male</option>
                                  <option value="female">Female</option>
                                  <option value="other">Other</option>
                                </select>
                                <small className="form-text text-muted">Select gender</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="dob">Date of Birth</label>
                                <input 
                                  type="date" 
                                  className="form-control" 
                                  placeholder="1990-10-10" 
                                  name="dob" 
                                  value={formData.dob}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Select date of birth</small>
                              </div>
                            </div>
                            <div className="col-md-6 col-lg-6">
                              <div className="form-group form-group-account">
                                <label htmlFor="last_name">Last Name</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="Smith" 
                                  name="last_name" 
                                  value={formData.last_name}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter last name.</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="email">Email</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="email" 
                                  name="email" 
                                  value={formData.email}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter email</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="phone2">Phone 2</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="67891011" 
                                  name="phone2" 
                                  value={formData.phone2}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter phone 2.</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="state">State</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="New York" 
                                  name="state" 
                                  value={formData.state}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter state</small>
                              </div>
                              <div className="form-group form-group-account">
                                <label htmlFor="address">Address</label>
                                <input 
                                  type="text" 
                                  className="form-control" 
                                  placeholder="House # 30, Street 32" 
                                  name="address" 
                                  value={formData.address}
                                  onChange={handleChange}
                                />
                                <small className="form-text text-muted">Enter address</small>
                              </div>
                            </div>
                            <div className="col-md-12 col-lg-12">
                              <div className="form-group form-group-account">
                                <label htmlFor="bio">Short Biography</label>
                                <textarea 
                                  className="form-control" 
                                  placeholder="Short Bio" 
                                  name="bio"
                                  value={formData.bio}
                                  onChange={handleChange}
                                  rows={4}
                                ></textarea>
                                <small className="form-text text-muted">Enter short biography</small>
                              </div>
                            </div>
                            <div className="col-md-12 col-lg-12">
                              <div className="form-group form-group-account">
                                <label htmlFor="image">Image File</label>
                                <input 
                                  type="file" 
                                  className="form-control" 
                                  name="image" 
                                  accept="image/*"
                                />
                                <small className="form-text text-muted">Only jpg or png allowed</small>
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
                                  disabled={saving}
                                >
                                  <i className="fa fa-floppy-o"></i> {saving ? 'Saving...' : 'Save'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

