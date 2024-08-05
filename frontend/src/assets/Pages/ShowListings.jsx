import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Delete from '../Components/Delete';
import Edit from '../Components/Edit';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ShowListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(null);

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

    useEffect(() => {
        if (deleteSuccess) {
            toast.success(deleteSuccess, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteSuccess(null); // Clear the message after showing
        }

        if (deleteError) {
            toast.error(deleteError, {
                position: "bottom-center",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
            setDeleteError(null); // Clear the message after showing
        }
    }, [deleteSuccess, deleteError]);

    const handleDelete = async (id) => {
        try {
            setDeleteLoading(true);
            const res = await fetch(`/api/delete/${id}`, {
                method: 'DELETE',
            });

            const data = await res.json();

            if (data.success === false) {
                setDeleteError(data.error);
                setDeleteSuccess(null);
            } else {
                setListings(prevListings => prevListings.filter(listing => listing._id !== id));
                setDeleteSuccess('Listing successfully deleted.');
                setDeleteError(null);
            }
        } catch (error) {
            setDeleteError('An error occurred while deleting the listing.');
            setDeleteSuccess(null);
        } finally {
            setDeleteLoading(false);
        }
    }

    if (loading) return <Loader />;
    if (deleteLoading) return <Loader />;

    return (
        <>
            <ToastContainer />
            <h1 className="text-3xl font-bold text-center mb-5">
                My Listings
            </h1>

            {error && <p className="text-center text-red-500">{error}</p>}

            {listings && listings.length > 0 ? (
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center">
                        {listings.map((listing) => (
                            <div key={listing._id} className="w-full max-w-2xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 p-4 flex flex-col sm:flex-row items-center">
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
                                <div className="flex space-x-2 mt-4 sm:mt-0">
                                    <Link to={`/editList/${listing._id}`} state={{listing}}>
                                        <Edit />
                                    </Link>
                                    <Delete onClick={() => handleDelete(listing._id)} />
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
