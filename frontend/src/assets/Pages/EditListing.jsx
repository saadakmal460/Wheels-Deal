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


const EditListing = () => {
    const [files, setFiles] = useState([]);
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
        setFormData({ ...formData, [name]: value });
    }


    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_, i) => i !== index),
        })
    }

    const validateForm = () => {
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
        if (formData.sellerAddress.trim().length === 0 || !formData.sellerAddress) {
            valid = false;
            errors.sellerAddress = 'Address is required';
        }
        if (formData.sellerContact.trim().length === 0 || !formData.sellerContact) {
            valid = false;
            errors.sellerContact = 'Contact is required';
        } else if (!/^\d{11}$/.test(formData.sellerContact.trim())) {
            valid = false;
            errors.sellerContact = 'Contact must be 11 digits long and only contain numbers';
        }
        if (!Array.isArray(formData.imageUrls) || formData.imageUrls.length === 0) {
            valid = false;
            errors.imageUrls = 'At least 1 image is required';
        }

        setFormError(errors);
        console.log('Errors' , errors);
        return valid;
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
        <main className="p-3 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-black capitalize mb-4">Post Your Vehicle</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="make">Make</label>
                        <input name="make" id="make" type="text" defaultValue={listingData.make} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.make && <p className="text-red-500 text-xs">{formError.make}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="model">Model</label>
                        <input name="model" id="model" type="text" defaultValue={listingData.model} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.model && <p className="text-red-500 text-xs">{formError.model}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="year">Year</label>
                        <input name="year" id="year" type="number" defaultValue={listingData.year} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.year && <p className="text-red-500 text-xs">{formError.year}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="mileage">Mileage</label>
                        <input name="mileage" id="mileage" type="number" defaultValue={listingData.mileage} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.mileage && <p className="text-red-500 text-xs">{formError.mileage}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="price">Price</label>
                        <input name="price" id="price" type="number" defaultValue={listingData.price} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.price && <p className="text-red-500 text-xs">{formError.price}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="description">Description</label>
                        <textarea name="description" id="description" defaultValue={listingData.description} onChange={handleInputChange} rows="7" style={{ resize: 'none' }} className="block w-full p-2.5 text-sm text-black rounded-lg border border-gray-300 shadow-sm" required></textarea>
                        {formError.description && <p className="text-red-500 text-xs">{formError.description}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Condition</label>
                        <div className="flex items-center space-x-2">
                            <input id="new" type="radio" value="new" name="condition" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="new">New</label>
                            <input id="used" type="radio" value="used" name="condition" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="used">Used</label>
                        </div>
                        {formError.condition && <p className="text-red-500 text-xs">{formError.condition}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Transmission</label>
                        <div className="flex items-center space-x-2">
                            <input id="automatic" type="radio" value="automatic" name="transmission" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="automatic">Automatic</label>
                            <input id="manual" type="radio" value="manual" name="transmission" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="manual">Manual</label>
                        </div>
                        {formError.transmission && <p className="text-red-500 text-xs">{formError.transmission}</p>}

                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="fuelType">Fuel Type</label>
                        <select
                            id="fuelType"
                            name="fuelType"
                            onChange={handleInputChange}
                            className="block w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="" disabled selected>Select Fuel Type</option>
                            {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG', 'Hydrogen'].map((fuel, index) => (
                                <option key={index} value={fuel.toLowerCase()}>
                                    {fuel}
                                </option>
                            ))}
                        </select>
                        {formError.fuelType && <p className="text-red-500 text-xs">{formError.fuelType}</p>}
                    </div>

                </form>

                <div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="contact">Contact</label>
                        <input name="sellerContact" id="contact" type="text" defaultValue={listingData.sellerContact} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.sellerContact && <p className="text-red-500 text-xs">{formError.sellerContact}</p>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="make">Address</label>
                        <input name="sellerAddress" id="address" type="text" defaultValue={listingData.sellerAddress} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md shadow-sm" required />
                        {formError.sellerAddress && <p className="text-red-500 text-xs">{formError.sellerAddress}</p>}
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
                        {formError.imageUrls && <p className="text-red-500 text-xs">{formError.imageUrls}</p>}

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
                            {uploading ? `Uploading ${progress} %` : 'Upload Images'}
                            <VisuallyHiddenInput type="file" />
                        </Button>
                    </div>

                    {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}



                    <div className="mb-2">
                        {formData.imageUrls.map((url, index) => (
                            <div key={url} className='flex justify-between items-center p-3'>
                                <img src={url} alt="uploaded vehicle" className="w-20 h-20 object-contain rounded-lg" />
                                <Delete onClick={() => { handleRemoveImage(index) }} />
                            </div>

                        ))}
                    </div>

                    <div className="mb-4">
                        <button disabled={loading} onClick={handleSubmit} type="submit" className="block w-full px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:opacity-90 disabled:opacity-80 focus:outline-none focus:bg-gray-600">{loading ? "Updating" : "Update Ad"}</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EditListing;