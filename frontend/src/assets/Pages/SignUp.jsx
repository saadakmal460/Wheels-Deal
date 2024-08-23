import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSpinner, FaUserPlus, FaUserCircle, FaExclamationCircle } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    'username': '',
    'email': '',
    'password': ''
  });
  const [formError, setFormError] = useState({});


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'username':
        error = value.trim().length === 0 ? 'Username is required' : '';
        break;
      case 'email':
        if (value.trim().length === 0) {
          error = 'Email is required';
        } else {
          // Regular expression for email validation
          const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailPattern.test(value)) {
            error = 'Invalid email format';
          }
        }
        break;
      case 'password':
        if (value.trim().length === 0) {
          error = 'Password is required';
        } else if (value.length < 8) { // Minimum length for password
          error = 'Password must be at least 8 characters long';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;


    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

    const error = validateField(name, value);
    setFormError((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const validateForm = () => {

    console.log('yes')
    console.log(formData)
    let valid = true;
    let errors = {};

    if (formData.username.trim().length === 0) {
      valid = false;
      errors.username = 'Username is required';
    }
    if (formData.email.trim().length === 0) {
      valid = false;
      errors.email = 'Email is required';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      valid = false;
      errors.email = 'Enter a valid Email';
    }
    if (formData.password.length < 8 || formData.password.trim().length === 0) {
      valid = false;
      errors.password = 'Enter a valid password! Minimum 8 characters';
    }

    console.log(errors, valid);


    setFormError(errors);
    return valid;
  };

  const handleSubmit = async (e) => {


    e.preventDefault();
    if (!validateForm()) {
      return;
    }

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
        setError(data.error);
        toast.error(data.error, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
        });
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/signIn');
    } catch (error) {
      console.log(error);

      setLoading(false);
      setError(error.message || 'An unexpected error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-8">
      <ToastContainer />

      <div className="p-6 sm:p-8 md:p-10 max-w-md md:max-w-lg lg:max-w-xl w-full shadow-lg rounded-lg bg-white relative card card1">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-3 shadow-lg">
          <FaUserCircle className="text-custom-blue text-6xl" />
        </div>
        <h1 className="text-4xl font-semibold mb-6 text-center mt-8">Sign Up</h1>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.username ? 'focus:ring-red-500' : 'focus:ring-custom-blue'
              }`}
            placeholder="Username"
            id="username"
            name='username'
            onChange={handleChange}
            style={{
              border: formError.username ? '1px solid red' : formError.username === '' ? '1px solid #0dd50d' : '1px solid #1ca9c9'
            }}
          />
          {formError.username && (
            <div className="text-red-500 text-sm flex items-center message">
              <FaExclamationCircle className="mr-2" />
              <p className="text-red-500 text-sm">{formError.username}</p>
            </div>
          )}
          <input
            type="email"
            className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.email ? 'focus:ring-red-500' : 'focus:ring-custom-blue'
              }`}
            placeholder="Email"
            id="email"
            name='email'
            onChange={handleChange}
            style={{
              border: formError.email ? '1px solid red' : formError.email === '' ? '1px solid #0dd50d' : '1px solid #1ca9c9'
            }}
          />
          {formError.email && (
            <div className="text-red-500 text-sm flex items-center message">
              <FaExclamationCircle className="mr-2" />
              <p className="text-red-500 text-sm">{formError.email}</p>
            </div>
          )}
          <input
            type="password"
            className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.password ? 'focus:ring-red-500' : 'focus:ring-custom-blue'
              }`}
            placeholder="Password"
            id="password"
            name='password'
            onChange={handleChange}
            style={{
              border: formError.password ? '1px solid red' : formError.password === '' ? '1px solid #0dd50d' : '1px solid #1ca9c9'
            }}
          />
          {formError.password && (
            <div className="text-red-500 text-sm flex items-center message">
              <FaExclamationCircle className="mr-2" />
              <p className="text-red-500 text-sm">{formError.password}</p>
            </div>
          )}

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

        </form>
      </div>
    </div>
  );
};

export default SignUp;
