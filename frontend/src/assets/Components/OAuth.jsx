import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../../firebase';
import { useDispatch } from 'react-redux';
import { signInSucess } from '../../Redux/User/UserSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {

    const provider = new GoogleAuthProvider();
    const auth = getAuth(app)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const result = await signInWithPopup(auth,provider);
            const res = await fetch('/api/signIn/google', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  name: result.user.displayName,
                  email: result.user.email,
                  photo: result.user.photoURL
                })
              });
            const data = res.json();
            dispatch(signInSucess(data));
            navigate('/profile');


        } catch (error) {
            console.log("Error contining with Google")
        }
    }
    return (

        <button onClick={handleClick} className="border flex gap-2 rounded-lg p-3 border-slate-700 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:shadow transition duration-150 flex items-center justify-center">
            <img className="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
            <span>Continue with Google</span>
        </button>

    );
};

export default OAuth;



