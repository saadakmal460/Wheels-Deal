import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { MdLocalGasStation } from 'react-icons/md';
import { FaTachometerAlt, FaDollarSign, FaCog, FaCar, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import Loader from '../Components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserIndiviualListing = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastShown, setToastShown] = useState(false);
    const location = useLocation();

    const available = location.state?.isTrue;
    const message = location.state?.message;

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
                    console.log(data)
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

    useEffect(() => {
        if (available && !toastShown) {
            toast.success(message, {
                position: "bottom-center",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
            });
            setToastShown(true);

            location.state.isTrue = false;
        }
    }, [available, toastShown, location.state]);

    if (loading) return <Loader />;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!listing) return <p className="text-center text-gray-500">No listing available.</p>;

    const { make, model, mileage, price, previousPrice, condition, fuelType, transmission, sellerContact, sellerAddress, description, imageUrls } = listing[0];
    

    return (
        <section className="container mx-auto px-4 py-8 max-w-5xl bg-white text-black border rounded-lg mt-5 mb-5">
            {/* Image Gallery */}
            <div className="lg:flex">
                <div className="lg:w-1/2 lg:pr-8">
                    <Carousel
                        showArrows={true}
                        infiniteLoop={true}
                        showThumbs={false}
                        className="mb-6"
                    >
                        {imageUrls.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image}
                                    alt={`Image ${index + 1}`}
                                    className="w-full h-96 object-cover rounded-lg shadow-lg"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
                {/* Product Details */}
                <div className="lg:w-1/2 lg:pl-8 mt-8 lg:mt-0">
                    <h2 className="text-3xl font-bold mb-4">{make} {model}</h2>
                    <p className="font-bold mb-2">
                        Price: <span className="text-2xl text-gray-800">{formatPrice(price)} <span className="text-xs line-through">{formatPrice(previousPrice)}</span>Rs</span>
                    </p>
                    <p className="mb-4">{description}</p>
                    <div className="flex items-center mb-4">
                        <FaTachometerAlt className="mr-2" /> <span>Mileage: {mileage.toLocaleString()} KM</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaDollarSign className="mr-2" /> <span>Price: {formatPrice(price)}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaCar className="mr-2" /> <span className='capitalize'>Condition: {condition}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <MdLocalGasStation className="mr-2" /> <span className='capitalize'>Fuel: {fuelType}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaCog className="mr-2" /> <span className='capitalize'>Transmission: {transmission}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaPhoneAlt className="mr-2" /> <span>Seller Contact: {sellerContact}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FaMapMarkerAlt className="mr-2" /> <span className='capitalize'>Seller Address: {sellerAddress}</span>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </section>
    );
};

export default UserIndiviualListing;
