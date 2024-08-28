import React, { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'
import Delete from '../Components/Delete';
import { useParams, useLocation } from 'react-router-dom';
import { FaCar, FaCamera, FaDollarSign, FaUser, FaExclamationCircle, FaCheckCircle, FaSpinner, FaArrowRight, FaArrowLeft, FaEdit } from 'react-icons/fa'



const EditListing = () => {
    const [files, setFiles] = useState([]);
    const [currentStep, setCurrentStep] = useState(1);

    const { id } = useParams();
    const location = useLocation();

    const listingData = location.state.listing;

    console.log(listingData.make);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({
        make: listingData.make,
        model: listingData.model,
        year: listingData.year,
        mileage: listingData.mileage,
        price: listingData.price,
        description: listingData.description,
        condition: listingData.condition,
        transmission: listingData.transmission,
        fuelType: listingData.fuelType,
        sellerContact: listingData.sellerContact,
        sellerAddress: listingData.sellerAddress,
        imageUrls: listingData.imageUrls
    });
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [user, setUser] = useState({});
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const [formError, setFormError] = useState({});
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const resolveUser = async () => {
            if (currentUser && currentUser instanceof Promise) {
                const result = await currentUser;
                setUser(result);
            } else {
                setUser(currentUser);
            }
        };
        resolveUser();
    }, [currentUser]);

    const handleImageSubmit = (e) => {
        e.preventDefault();
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {

            setUploading(true);
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageError(false);
                setUploading(false);
            }).catch((error) => {
                setImageError('2mb MAX');
            })
        } else {
            setImageError('Upload 6 images per post');
            setUploading(false);
        }
    }

    const storeImage = (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setProgress(Math.round(progress));
                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
                        resolve(downloadUrl);
                    });
                }
            )
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        const error = validateField(name, value);
        setFormError((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));


        console.log(formError)
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        const error = validateField(name, value);
        setFormError((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
        console.log('Error', formError)
    };


    const handleRemoveImage = (index) => {

        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    }

    const validateField = (name, value) => {
        let error = '';

        switch (name) {
            case 'make':
                error = value.trim().length === 0 ? 'Make is required' : '';
                break;
            case 'model':
                error = value.trim().length === 0 ? 'Model is required' : '';
                break;
            case 'year':
                error = value <= 0 || isNaN(value) ? 'Valid year is required' : '';
                break;
            case 'mileage':
                error = parseInt(value, 10) < 0 || isNaN(parseInt(value, 10)) ? 'Mileage cannot be negative' : '';
                break;
            case 'price':
                error = parseInt(value, 10) < 0 || isNaN(parseInt(value, 10)) ? 'Price cannot be negative' : '';
                break;
            case 'description':
                error = value.trim().length === 0 || value.length > 500 ? 'Description is required and cannot exceed 500 characters' : '';
                break;
            case 'condition':
                error = !value ? 'Condition is required' : '';
                break;
            case 'transmission':
                error = !value ? 'Transmission is required' : '';
                break;
            case 'fuelType':
                error = !value ? 'Fuel type is required' : '';
                break;
            case 'sellerAddress':
                error = value.trim().length === 0 ? 'Address is required' : '';
                break;
            case 'sellerContact':
                error = value.trim().length === 0 ? 'Contact is required' :
                    !/^\d{11}$/.test(value.trim()) ? 'Contact must be 11 digits long and only contain numbers' : '';
                break;
            case 'imageUrls':
                error = !Array.isArray(value) || value.length === 0 ? 'At least 1 image is required' : '';
                break;
            default:
                break;
        }

        return error;
    };

    const validateForm = () => {
        let valid = true;
        let errors = {};

        Object.keys(formData).forEach((key) => {
            const error = validateField(key, formData[key]);
            if (error) {
                valid = false;
                errors[key] = error;
            }
        });

        setFormError(errors);
        return valid;
    };

    const validateFormFirst = () => {
        let valid = true;
        let errors = {};

        if (formData.make.trim().length === 0) {
            valid = false;
            errors.make = 'Make is required';
        }
        if (formData.model.trim().length === 0) {
            valid = false;
            errors.model = 'Model is required';
        }
        if (formData.year <= 0 || isNaN(formData.year)) {
            valid = false;
            errors.year = 'Valid year is required';
        }
        if (parseInt(formData.mileage, 10) < 0 || isNaN(parseInt(formData.mileage, 10))) {
            valid = false;
            errors.mileage = 'Mileage cannot be negative';
        }

        if (parseInt(formData.price, 10) < 0 || isNaN(parseInt(formData.price, 10))) {
            valid = false;
            errors.price = 'Price cannot be negative';
        }

        if (formData.description.trim().length === 0 || formData.description.length > 500) {
            valid = false;
            errors.description = 'Description is required and cannot exceed 500 characters';
        }
        if (!formData.condition) {
            valid = false;
            errors.condition = 'Condition is required';
        }
        if (!formData.transmission) {
            valid = false;
            errors.transmission = 'Transmission is required';
        }
        if (!formData.fuelType) {
            valid = false;
            errors.fuelType = 'Fuel type is required';
        }
        setFormError(errors);
        return valid;
    };

    const validateFormSecond = () => {
        let valid = true;
        let errors = {};

        if (!Array.isArray(formData.imageUrls) || formData.imageUrls.length === 0) {
            valid = false;
            errors.imageUrls = 'At least 1 image is required';
        }

        setFormError(errors);
        return valid;
    };

    const validateFormThird = () => {
        let valid = true;
        let errors = {};

        if (formData.sellerAddress.trim().length === 0) {
            valid = false;
            errors.sellerAddress = 'Address is required';
        }
        if (formData.sellerContact.trim().length === 0) {
            valid = false;
            errors.sellerContact = 'Contact is required';
        } else if (!/^\d{11}$/.test(formData.sellerContact.trim())) {
            valid = false;
            errors.sellerContact = 'Contact must be 11 digits long and only contain numbers';
        }

        setFormError(errors);
        return valid;
    };






    const handleNext = () => {

        if (currentStep == 1 && !validateFormFirst()) {
            return;
        }

        if (currentStep == 2 && !validateFormSecond()) {
            return;
        }

        if (currentStep == 3 && !validateFormThird()) {
            return;
        }

        setCurrentStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {


        if (!validateForm()) {
            return;
        }

        console.log(formError)

        setLoading(true);
        try {
            const res = await fetch(`/api/updateListing/${id}`,
                {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData, userRef: user._id }),
                }
            )

            const data = await res.json();

            if (data.sucess === false) {
                setError(data.error);
                return;
            }

            setLoading(false);
            console.log(data);


            navigate(`/listing/${data.data._id}`, { state: { isTrue: true, message: 'Ad Updated Sucessfully' } });

        } catch (error) {
            setError(error);
        }
    }

    const VisuallyHiddenInput = styled('input')({
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });


    console.log(formData);



    return (
        <>

<main className="p-3 max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-black capitalize mb-4">Post Your Vehicle</h1>
                <form onSubmit={handleSubmit}>
                    {currentStep === 1 && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 card1">
                            <div className="flex items-center mb-4">
                                <FaCar className="text-BLACK text-2xl mr-2" />
                                <h2 className="text-xl font-semibold text-black">Vehicle Information</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="make">Make</label>
                                    <input
                                        name="make"
                                        id="make"
                                        type="text"
                                        value={formData.make}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white 
                                            rounded-md focus:outline-none focus:ring-1 ${formError.make ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.make ? '1px solid red' : formError.make === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}

                                        required
                                    />
                                    {formError.make && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle className="text-red-500 mr-2" style={{ fontSize: '1rem' }} />
                                            <p className="text-red-500 text-sm m-0">{formError.make}</p>
                                        </div>
                                    )}

                                </div>

                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="model">Model</label>
                                    <input
                                        name="model"
                                        id="model"
                                        type="text"
                                        value={formData.model}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white
                                            rounded-md focus:outline-none focus:ring-1 ${formError.model ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.model ? '1px solid red' : formError.model === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    />
                                    {formError.model && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.model}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Year Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="year">Year</label>
                                    <input
                                        name="year"
                                        id="year"
                                        type="number"
                                        min="1900"
                                        max="2099"
                                        step="1"
                                        value={formData.year}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white
                                            rounded-md focus:outline-none focus:ring-1 ${formError.year ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.year ? '1px solid red' : formError.year === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    />
                                    {formError.year && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.year}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Mileage Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="mileage">Mileage</label>
                                    <input
                                        name="mileage"
                                        id="mileage"
                                        type="number"
                                        value={formData.mileage}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-1 ${formError.mileage ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.mileage ? '1px solid red' : formError.mileage === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    />
                                    {formError.mileage && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.mileage}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Price Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="price">Price</label>
                                    <input
                                        name="price"
                                        id="price"
                                        type="number"
                                        value={formData.price}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white rounded-md focus:outline-none focus:ring-1 ${formError.price ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.price ? '1px solid red' : formError.price === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    />
                                    {formError.price && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.price}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="description">Description</label>
                                    <textarea
                                        name="description"
                                        id="description"
                                        value={formData.description}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        rows="7"
                                        className={`block w-full p-2.5 text-sm text-black rounded-lg 
                                            focus:outline-none focus:ring-1 ${formError.description ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            resize: 'none', border: formError.description ? '1px solid red' : formError.description === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    ></textarea>
                                    {formError.description && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.description}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Condition Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2">Condition</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="new"
                                            type="radio"
                                            value="new"
                                            name="condition"
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            className={`w-4 h-4`}
                                            style={{
                                                border: formError.condition ? '1px solid red' : formError.condition === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                            }}
                                            required
                                        />
                                        <label className="text-sm font-medium text-black" htmlFor="new">New</label>
                                        <input
                                            id="used"
                                            type="radio"
                                            value="used"
                                            name="condition"
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            className={`w-4 h-4`}
                                            required
                                        />
                                        <label className="text-sm font-medium text-black" htmlFor="used">Used</label>
                                    </div>
                                    {formError.condition && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.condition}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Transmission Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2">Transmission</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            id="automatic"
                                            type="radio"
                                            value="automatic"
                                            name="transmission"
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            className={`w-4 h-4`}
                                            required
                                        />
                                        <label className="text-sm font-medium text-black" htmlFor="automatic">Automatic</label>
                                        <input
                                            id="manual"
                                            type="radio"
                                            value="manual"
                                            name="transmission"
                                            onBlur={handleBlur}
                                            onChange={handleInputChange}
                                            className={`w-4 h-4`}
                                            required
                                        />
                                        <label className="text-sm font-medium text-black" htmlFor="manual">Manual</label>
                                    </div>
                                    {formError.transmission && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.transmission}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Fuel Type Field */}
                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="fuelType">Fuel Type</label>
                                    <select
                                        name="fuelType"
                                        id="fuelType"
                                        value={formData.fuelType}
                                        onBlur={handleBlur}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white
                                            rounded-md focus:outline-none focus:ring-1 ${formError.fuelType ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.fuelType ? '1px solid red' : formError.fuelType === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required
                                    >
                                        <option value="">Select fuel type</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                    {formError.fuelType && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.fuelType}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end mt-8">

                                <button type="button" className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-blue-hover disabled:bg-blue-300 transition-colors duration-200 ease-in-out" onClick={handleNext}>
                                    Next <FaArrowRight className="inline-block mr-2 iconButton" />
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 card1">
                            <div className="flex items-center mb-4">
                                <FaCamera className="text-custom-blue text-2xl mr-2" />
                                <h2 className="text-xl font-semibold text-custom-blue">Photos</h2>
                            </div>

                            <div className="mb-4">
                                <label htmlFor="file-upload" className="block text-sm font-medium text-black">Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-8 w-12 text-black" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round
                                        " strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 hover:text-indigo-500">
                                                <span>Upload a file</span>
                                                <input id="file-upload" name="file-upload" type="file" multiple accept=".jpg,.png,.jpeg" className="sr-only" onChange={(e) => setFiles(e.target.files)} />
                                            </label>
                                        </div>
                                        <p className="text-xs text-black">PNG, JPG, GIF up to 2MB</p>
                                    </div>
                                </div>
                                {formError.imageUrls && (
                                    <div className="text-red-500 text-sm flex items-center mt-1">
                                        <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                        <p className="text-red-500 text-sm m-0">{formError.imageUrls}</p>
                                    </div>
                                )}

                            </div>
                            <div className="mb-4">
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUploadIcon />}
                                    disabled={uploading} onClick={handleImageSubmit}
                                >
                                    {uploading ? `Uploading ${progress}%` : 'Upload Images'}
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                            </div>

                            {imageError && (
                                <div className=" text-red-500 text-xs flex items-center mt-1">
                                    <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-1" />
                                    <p className="text-red-500 text-xs m-0">{imageError}</p>
                                </div>
                            )}



                            <div className="mb-2">
                                {formData.imageUrls.map((url, index) => (
                                    <div key={url} className='flex justify-between items-center p-3'>
                                        <img src={url} alt="uploaded vehicle" className="w-20 h-20 object-contain rounded-lg" />
                                        <Delete onClick={() => { handleRemoveImage(index) }} />
                                    </div>

                                ))}
                            </div>

                            <div className="flex justify-between mt-8">
                                <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 ease-in-out" onClick={handleBack}>
                                    <FaArrowLeft className="inline-block mr-2 iconButton" />Back

                                </button>
                                <button type="button" className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-blue-hover disabled:bg-blue-300 transition-colors duration-200 ease-in-out" onClick={handleNext}>
                                    Next <FaArrowRight className="inline-block mr-2 iconButton" />
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 card1">
                            <div className="flex items-center mb-4">
                                <FaDollarSign className="text-custom-blue text-2xl mr-2" />
                                <h2 className="text-xl font-semibold text-custom-blue">Demand & Seller Info</h2>
                            </div>

                            <div className="space-y-4">

                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="name">City</label>
                                    <input name="sellerAddress" id="address" type="text"
                                        value={formData.sellerAddress}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white
                                        rounded-md focus:outline-none focus:ring-1 ${formError.sellerAddress ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.sellerAddress ? '1px solid red' : formError.sellerAddress === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required />
                                    {formError.sellerAddress && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.sellerAddress}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="block text-black mb-2" htmlFor="phone">Contact No</label>
                                    <input name="sellerContact" id="sellerContact" type="tel"
                                        value={formData.sellerContact}
                                        onChange={handleInputChange}
                                        className={`block w-full px-4 py-2 text-black bg-white
                                        rounded-md focus:outline-none focus:ring-1 ${formError.sellerContact ? 'focus:ring-red-500' : 'focus:ring-gray-500'
                                            }`}
                                        style={{
                                            border: formError.sellerContact ? '1px solid red' : formError.sellerContact === '' ? '1px solid #0dd50d' : '1px solid rgb(144 136 136)'
                                        }}
                                        required />
                                    {formError.sellerContact && (
                                        <div className="text-red-500 text-sm flex items-center mt-1">
                                            <FaExclamationCircle style={{ fontSize: '1rem' }} className="mr-2" />
                                            <p className="text-red-500 text-sm m-0">{formError.sellerContact}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 ease-in-out" onClick={handleBack}>
                                    <FaArrowLeft className="inline-block mr-2 iconButton" />Back

                                </button>
                                <button type="button" className="px-4 py-2 bg-custom-blue text-white rounded-lg hover:bg-blue-hover disabled:bg-blue-300 transition-colors duration-200 ease-in-out" onClick={handleNext}>
                                    Next <FaArrowRight className="inline-block mr-2 iconButton" />
                                </button>
                            </div>
                        </div>
                    )}

                    {currentStep === 4 && (

                        <div className="bg-white shadow-md rounded-lg p-6 mb-6 card1">
                            <div className="text-center mb-6">
                                <FaCheckCircle className="text-custom-blue text-6xl mb-4 mx-auto" />
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">Ready to Post Ad</h2>
                                <p className="text-lg text-gray-600">All done! Click on submit to post your ad.</p>
                            </div>
                            <div className="flex justify-center mb-4">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="bg-custom-blue text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-hover disabled:bg-blue-hover transition-colors duration-300 ease-in-out"
                                >
                                    {loading ? (
                                        <span>
                                            <FaSpinner className="inline-block mr-2 animate-spin" />
                                        </span>
                                    ) : (
                                        <span>
                                            Submit <FaArrowRight className="inline-block mr-2" />
                                        </span>
                                    )}
                                </button>
                            </div>
                            <div className="flex justify-between mt-8">
                                <button type="button" className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 ease-in-out" onClick={handleBack}>
                                    <FaArrowLeft className="inline-block mr-2 iconButton" />Back
                                </button>

                            </div>
                        </div>


                    )

                    }
                </form>
            </main>
        </>
    );
};

export default EditListing;