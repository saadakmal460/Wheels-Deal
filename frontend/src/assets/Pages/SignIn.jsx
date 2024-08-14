import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInFailure, signInSucess } from '../../Redux/User/UserSlice';
import { FaSignInAlt, FaSpinner } from 'react-icons/fa';


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

  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      dispatch(signInStart());
      const res = await fetch('/api/signIn',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        dispatch(signInFailure(errorData.error));
        return;
      }

      const data = await res.json();

      if (data.sucess === false) {

        dispatch(signInFailure(data.error));
        return;
      }

      dispatch(signInSucess(data));
      console.log('User Created');
      console.log(data);
      navigate('/');

    } catch (error) {
      dispatch(signInFailure(error));

    }


  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Sign In</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <input type="email" className='border p-3 rounded-lg' placeholder='Email' id='email' onChange={handleChange} />
        <input type="password" className='border p-3 rounded-lg' placeholder='Password' id='password' onChange={handleChange} />

        <button
          className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-90 disabled:opacity-80'
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

        <div className='flex gap-2'>
          <p>Dont Have an account? </p>
          <Link to={"/signUp"}>
            <span className='text-blue-700 hover:underline'>Sign Up</span>
          </Link>

        </div>
        {error && <p className='text-red-500'>{error}</p>}

      </form>
    </div>
  )
}

export default SignIn