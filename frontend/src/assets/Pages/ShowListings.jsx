import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Delete from '../Components/Delete';
import Edit from '../Components/Edit';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';

const ShowListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useSelector((state) => state.user);

    useEffect(() => {
        const fetchListings = async () => {
            if (currentUser) {
                try {
                    const res = await fetch(`/api/userListings/${currentUser._id}`, {
                        method: 'GET',
                    });
                    const data = await res.json();

                    if (data.success === false) {
                        setError(data.error);
                        setListings([]);
                    } else {
                        setListings(data);
                    }
                } catch (err) {
                    setError('An error occurred while fetching data.');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchListings();
    }, [currentUser]);

    if (loading) return <Loader/>;


    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-5">
                My Listings
            </h1>

            {error && <p className="text-center text-red-500">{error}</p>}

            {listings && listings.length > 0 ? (
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center">
                        {listings.map((listing) => (
                            <div key={listing.id} className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 p-4 flex items-center">
                                <img
                                    className="w-24 h-24 rounded object-cover mr-4"
                                    src={listing.imageUrls[0] || '/docs/images/blog/image-1.jpg'}
                                    alt=""
                                />
                                <div className="flex-grow">
                                    <Link to={`/listing/${listing._id}`}>
                                        <h5 className="text-xl font-bold tracking-tight text-black">
                                            {listing.make + " " + listing.model}
                                        </h5>
                                    </Link>
                                </div>
                                <div className="flex space-x-2">
                                    <Edit />
                                    <Delete listingId={listing.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500">No listings available.</p>
            )}
        </>
    );
};

export default ShowListings;
