import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MdLocalGasStation } from 'react-icons/md';
import { FaTachometerAlt, FaDollarSign, FaCog,FaExclamationCircle , FaCar } from 'react-icons/fa';
import Loader from '../Components/Loader';

const UserIndiviualListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const res = await fetch(`/api/listing/${id}`, {
                    method: 'GET',
                });
                const data = await res.json();

                if (data.success === false) {
                    setError(data.error);
                    setListing(null);
                } else {
                    setListing(data);
                }
            } catch (err) {
                setError('An error occurred while fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    const formatPrice = (price) => {
        if (price >= 1_000_000) {
            return `${(price / 1_000_000).toFixed(1)}M`;
        } else if (price >= 1_000) {
            return `${(price / 1_000).toFixed(1)}k`;
        } else {
            return price;
        }
    };
    

    if (loading) return <Loader/>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!listing) return <p className="text-center text-gray-500">No listing available.</p>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <div className="bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
                <Carousel showArrows={true} infiniteLoop={true} showThumbs={false} className="mb-6">
                    {listing[0].imageUrls.map((url, index) => (
                        <div key={index} className="relative">
                            <img src={url} alt={`Image ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                        </div>
                    ))}
                </Carousel>
                <div className="p-6">
                    <h2 className="text-3xl font-bold mb-4">{listing[0].make} {listing[0].model}</h2>
                    <div className="mb-4 space-y-2">
                        <div className="text-lg font-medium text-gray-800 flex items-center">
                            <FaTachometerAlt className="mr-2 text-gray-700" /> Mileage: {listing[0].mileage.toLocaleString()} KM
                        </div>
                        <div className="text-lg font-medium text-gray-800 flex items-center">
                            <FaDollarSign className="mr-2 text-gray-700" /> Price: {formatPrice(listing[0].price)} Rs
                        </div>
                        <div className="text-lg font-medium text-gray-800 flex items-center">
                            <FaCar className="mr-2 text-gray-700" /> Condtion: {listing[0].condition}
                        </div>
                        <div className="text-lg font-medium text-gray-800 flex items-center">
                            <MdLocalGasStation className="mr-2 text-gray-700" /> Fuel: {listing[0].fuelType}
                        </div>
                        <div className="text-lg font-medium text-gray-800 flex items-center">
                            <FaCog className="mr-2 text-gray-700" /> Transmission: {listing[0].transmission}
                        </div>
                    </div>
                    <p className="text-lg text-gray-700">
                        <span className="font-semibold">Description:</span> {listing[0].description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserIndiviualListing;
