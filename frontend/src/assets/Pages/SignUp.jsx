import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });

  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await fetch('/api/signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (data.sucess === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      navigate('/signIn');

    } catch (error) {
      setLoading(false);
      setError(error);
    }


  }


  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold my-7 text-center'>Sign Up</h1>

      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>

        <input type="text" className='border p-3 rounded-lg' placeholder='Username' id='username' onChange={handleChange} />
        <input type="email" className='border p-3 rounded-lg' placeholder='Email' id='email' onChange={handleChange} />
        <input type="password" className='border p-3 rounded-lg' placeholder='Password' id='password' onChange={handleChange} />

        <button className='bg-slate-700 text-white rounded-lg uppercase p-3 hover:opacity-90 disabled:opacity-80' disabled={loading}> {loading ? 'Creating User' : 'Sign Up'}</button>

        <div className='flex gap-2'>
          <p>Have an account? </p>
          <Link to={"/signIn"}>
            <span className='text-blue-700 hover:underline'>Sign In</span>
          </Link>

        </div>

      </form>
    </div>
  )
}

export default SignUp
