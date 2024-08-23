import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSuccess } from '../../Redux/User/UserSlice';
import { FaSignInAlt, FaSpinner , FaUserCircle } from 'react-icons/fa';

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(signInFailure(errorData.error?.message || 'An error occurred'));
        return;
      }

      const data = await res.json();

      if (data.success === false) {
        dispatch(signInFailure(data.error?.message || 'Sign in failed'));
        return;
      }

      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message || 'An unexpected error occurred'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <div className="p-6 sm:p-8 md:p-10 max-w-md md:max-w-lg lg:max-w-xl w-full shadow-lg rounded-lg bg-white relative card">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
          <FaUserCircle className="text-custom-blue text-6xl" />
        </div>
        <h1 className="text-4xl font-semibold mb-6 text-center mt-8">Sign In</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
            className="bg-custom-blue text-white rounded-lg uppercase p-3 mt-4 flex justify-center items-center hover:bg-blue-hover disabled:bg-custom-blue transition-colors duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? (
              <span>
                <FaSpinner className="inline-block mr-2 animate-spin" /> Signing In
              </span>
            ) : (
              <span>
                <FaSignInAlt className="inline-block mr-2" /> Sign In
              </span>
            )}
          </button>

          <div className="flex justify-center mt-4 gap-2">
            <p>Don't Have an account?</p>
            <Link to="/signUp" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </div>
          {error && <p className="text-red-500 text-center mt-4">{error.message || error}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
