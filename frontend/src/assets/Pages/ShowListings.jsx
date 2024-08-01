import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Delete from '../Components/Delete';

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

    if (loading) return <p className="text-center text-gray-500">Loading...</p>;

    return (
        <>
            <h1 className="text-3xl font-bold text-center mb-5">
                My Listings
            </h1>

            {error && <p className="text-center text-red-500">{error}</p>}

            {listings && listings.length > 0 ? (
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                        {listings.map((listing) => (
                            <div key={listing.id} className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                                <img
                                    className="rounded-t-lg w-full h-60 object-cover"
                                    src={listing.imageUrls[0] || '/docs/images/blog/image-1.jpg'}
                                    alt=""
                                />


                                <div className="p-5">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-black">
                                        {listing.make + " " + listing.model || 'Noteworthy technology acquisitions 2021'}
                                    </h5>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {listing.year || 'Year'}
                                    </p>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {listing.description || 'Description'}
                                    </p>
                                    <div className="flex justify-between">
                                        <Delete />
                                        <Delete />
                                    </div>
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
