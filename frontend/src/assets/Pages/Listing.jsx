import React, { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../../firebase';

const VehicleListing = () => {
    const [files, setFiles] = useState([]);
    const [imageError, setImageError] = useState(false);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        mileage: '',
        price: '',
        description: '',
        condition: '',
        transmission: '',
        fuelType: '',
        imageUrls: []
    });

    const handleImageSubmit = (e) => {
        e.preventDefault();
        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            const promises = [];

            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }

            Promise.all(promises).then((urls) => {
                setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                setImageError(false);
            }).catch((error) => {
                setImageError('2mb MAX');
            })
        } else {
            setImageError('Upload 6 images per post');
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
                    console.log(Math.round(progress));
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

    return (
        <main className="p-3 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-black capitalize mb-4">Post Your Vehicle</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <form className="space-y-4">
                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="make">Make</label>
                        <input name="make" id="make" type="text" value={formData.make} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="model">Model</label>
                        <input name="model" id="model" type="text" value={formData.model} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="year">Year</label>
                        <input name="year" id="year" type="number" value={formData.year} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="mileage">Mileage</label>
                        <input name="mileage" id="mileage" type="number" value={formData.mileage} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="price">Price</label>
                        <input name="price" id="price" type="number" value={formData.price} onChange={handleInputChange} className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md" required />
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2" htmlFor="description">Description</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows="7" style={{ resize: 'none' }} className="block w-full p-2.5 text-sm text-black rounded-lg border border-gray-300" required></textarea>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Condition</label>
                        <div className="flex items-center space-x-2">
                            <input id="new" type="radio" value="new" name="condition" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="new">New</label>
                            <input id="used" type="radio" value="used" name="condition" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="used">Used</label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Transmission</label>
                        <div className="flex items-center space-x-2">
                            <input id="automatic" type="radio" value="automatic" name="transmission" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="automatic">Automatic</label>
                            <input id="manual" type="radio" value="manual" name="transmission" onChange={handleInputChange} className="w-4 h-4" required />
                            <label className="text-sm font-medium text-black" htmlFor="manual">Manual</label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black mb-2">Fuel Type</label>
                        <div className="flex flex-wrap gap-2">
                            {['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG', 'Hydrogen'].map((fuel, index) => (
                                <div key={index} className="flex items-center space-x-2">
                                    <input id={fuel.toLowerCase()} type="radio" value={fuel.toLowerCase()} name="fuelType" onChange={handleInputChange} className="w-4 h-4" required />
                                    <label className="text-sm font-medium text-black" htmlFor={fuel.toLowerCase()}>{fuel}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mb-4">
                        <button type="submit" className="block w-full px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:opacity-90 disabled:opacity-80 focus:outline-none focus:bg-gray-600">Save</button>
                    </div>
                </form>

                <div>
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
                    </div>
                    <div className="mb-4">
                        <button onClick={handleImageSubmit} className="block w-full px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:opacity-90 disabled:opacity-80 focus:outline-none focus:bg-gray-600">Upload Image</button>
                    </div>

                    {imageError && <p className="text-red-500 text-xs mt-1">{imageError}</p>}

                    

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        {formData.imageUrls.map((url, index) => (
                            <div key={index} className="relative w-40 h-40 border border-gray-300 rounded-lg overflow-hidden">
                                <img src={url} alt="uploaded vehicle" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>

                    <div className="mb-4">
                        <button type="submit" className="block w-full px-6 py-2 leading-5 text-white transition-colors duration-200 transform bg-slate-700 rounded-md hover:opacity-90 disabled:opacity-80 focus:outline-none focus:bg-gray-600">Save</button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default VehicleListing;