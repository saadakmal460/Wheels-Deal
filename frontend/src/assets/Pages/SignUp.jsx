import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaUserPlus , FaUserCircle } from 'react-icons/fa';

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/signIn');
    } catch (error) {
      setLoading(false);
      setError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="p-6 sm:p-8 md:p-10 max-w-md md:max-w-lg lg:max-w-xl w-full shadow-lg rounded-lg bg-white relative card">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
          <FaUserCircle className="text-custom-blue text-6xl" />
        </div>
        <h1 className="text-4xl font-semibold mb-6 text-center mt-8">Sign Up</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className="border p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom-blue"
            placeholder="Username"
            id="username"
            onChange={handleChange}
          />
          <input
            type="email"
            className="border p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom-blue"
            placeholder="Email"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            className="border p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-custom-blue"
            placeholder="Password"
            id="password"
            onChange={handleChange}
          />

          <button
            className="bg-custom-blue text-white rounded-lg uppercase p-3 mt-4 flex justify-center items-center hover:bg-blue-hover disabled:bg-blue-300 transition-colors duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span>
                <FaSpinner className="inline-block mr-2 animate-spin" /> Creating User
              </span>
            ) : (
              <span>
                <FaUserPlus className="inline-block mr-2" /> Sign Up
              </span>
            )}
          </button>

          <div className="flex justify-center mt-4 gap-2">
            <p>Have an account?</p>
            <Link to="/signIn" className="text-blue-500 hover:underline">
              Sign In
            </Link>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
