import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { updateUserStart, updateUserFailure, updateUserSucess } from '../../Redux/User/UserSlice';
import { FaEdit, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditProfile = () => {
    
    const { loading, error } = useSelector((state) => state.user);
    const [fileProgress, setFileProgress] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState(null);
    const fileRef = useRef(null);
    const [file, setFile] = useState(undefined);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateSucess, setupdateSucess] = useState(false);
    const [formError, setFormError] = useState({});
    const [formData, setFormData] = useState({
        'username': '',
        'email': '',
        'password': ''
    });


    useEffect(() => {
        const resolveUser = async () => {
            if (currentUser && currentUser instanceof Promise) {
                const result = await currentUser;
                setUser(result);
            } else {
                setUser(currentUser);
                setFormData({
                    'username': user.username,
                    'email': user.email,
                })
            }
        };
        resolveUser();
    }, [currentUser]);

    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);

    

    console.log(user)

    const handleFileUpload = (file) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const fileRef = ref(storage, fileName);

        const uploadTask = uploadBytesResumable(fileRef, file);

        uploadTask.on('state_changed', (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setFileProgress(Math.round(progress));

        }, (error) => {
            setFileUploadError(true);
            toast.error('Error uploading file');
        }, () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                setFormData((prevFormData) => ({ ...prevFormData, avatar: downloadUrl }));
            })
        })
    }

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
        if (formData.password && (formData.password.length < 8 || formData.password.trim().length === 0)) {
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
            dispatch(updateUserStart());
            const res = await fetch(`/api/updateUser/${user._id}`,
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
                dispatch(updateUserFailure(errorData.error));
                toast.error(errorData.error);
                return;
            }

            const data = await res.json();

            if (data.sucess === false) {
                dispatch(updateUserFailure(data.error));
                toast.error(data.error);
                return;
            }

            dispatch(updateUserSucess(data));
            setupdateSucess(true);
            toast.success('Profile updated successfully');

        } catch (error) {
            dispatch(updateUserFailure(error));
            toast.error('An error occurred while updating the profile');
        }
    }

    return (
        <>
            <div className='p-4 max-w-lg mx-auto bg-white shadow-lg rounded-lg mt-3 card1'>
                <h1 className='text-3xl font-semibold my-7 text-center text-black'>Profile</h1>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <input type="file" name="" id="" hidden ref={fileRef} accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
                    <img onClick={() => fileRef.current.click()} src={formData.avatar || (user ? user.avatar : '')} alt="" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center border-2 border-gray-300' />
                    <p className='text-sm self-center text-black'>{fileUploadError ? <span className='text-red-500'>Error Uploading File</span> : fileProgress > 0 && fileProgress < 100 ? (<span className='text-slate-500'>{`Uploading ${fileProgress}%`}</span>) : fileProgress === 100 ? (<span className='text-green-600'>File Uploaded Successfully</span>) : ""}</p>
                    <input
                        type="text"
                        className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.username
                            ? 'focus:ring-red-500' // Red ring on error
                            : formError.username === ''
                                ? 'focus:ring-green-500' // Green ring on success
                                : 'focus:ring-gray-500' // Gray ring for default (no error or success)
                            }`}
                        placeholder="Username"
                        id="username"
                        name="username"
                        defaultValue={user ? user.username : ''}
                        onChange={handleChange}
                        style={{
                            border: formError.username
                                ? '1px solid red' // Red border on error
                                : formError.username === ''
                                    ? '1px solid #0dd50d' // Green border on success
                                    : '1px solid rgb(144 136 136)' // Black border for default (no error or success)
                        }}
                    />
                    {formError.username && (
                        <div className="text-red-500 text-sm flex items-center err">
                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                            <p className="m-0">{formError.username}</p>
                        </div>
                    )}


                    {/* Email Input Field */}
                    <input
                        type="email"
                        className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.email
                            ? 'focus:ring-red-500' // Red ring on error
                            : formError.email === ''
                                ? 'focus:ring-green-500' // Green ring on success
                                : 'focus:ring-gray-500' // Gray ring for default (no error or success)
                            }`}
                        placeholder="Email"
                        id="email"
                        name="email"
                        defaultValue={user ? user.email : ''}
                        onChange={handleChange}
                        style={{
                            border: formError.email
                                ? '1px solid red' // Red border on error
                                : formError.email === ''
                                    ? '1px solid #0dd50d' // Green border on success
                                    : '1px solid rgb(144 136 136)' // Black border for default (no error or success)
                        }}
                    />
                    {formError.email && (
                        <div className="text-red-500 text-sm flex items-center err">
                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                            <p className="text-red-500 text-sm m-0">{formError.email}</p>
                        </div>
                    )}

                    {/* Password Input Field */}
                    <input
                        type="password"
                        className={`p-3 rounded-lg focus:outline-none focus:ring-1 ${formError.password
                            ? 'focus:ring-red-500' // Red ring on error
                            : formError.password === ''
                                ? 'focus:ring-green-500' // Green ring on success
                                : 'focus:ring-gray-500' // Gray ring for default (no error or success)
                            }`}
                        placeholder="Password"
                        id="password"
                        name="password"

                        onChange={handleChange}
                        style={{
                            border: formError.password
                                ? '1px solid red' // Red border on error
                                : formError.password === ''
                                    ? '1px solid #0dd50d' // Green border on success
                                    : '1px solid rgb(144 136 136)' // Black border for default (no error or success)
                        }}
                    />
                    {formError.password && (
                        <div className="text-red-500 text-sm flex items-center err">
                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                            <p className="text-red-500 text-sm m-0">{formError.password}</p>
                        </div>
                    )}

                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        type="submit"
                        className="block w-full px-6 py-2 mb-4 leading-5 text-white transition-colors duration-200 transform bg-custom-blue rounded-md hover:opacity-90 disabled:opacity-80 focus:outline-none focus:bg-gray-600"
                    >
                        {loading ? (
                            <span>
                                <FaSpinner className="inline-block mr-2 animate-spin" /> Updating
                            </span>
                        ) : (
                            <span>
                                <FaEdit className="inline-block mb-1" /> Update
                            </span>
                        )}
                    </button>
                </form>
            </div>
            <ToastContainer />
        </>
    )
}

export default EditProfile;
