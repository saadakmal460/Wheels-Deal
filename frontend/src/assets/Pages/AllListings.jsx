import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaDollarSign, FaCar, FaCogs, FaCalendar, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Loader from '../Components/Loader';

const AllListings = () => {
    const [listings, setListings] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [visibleListings, setVisibleListings] = useState(5); // Initial number of listings to show

    useEffect(() => {
        const fetchListings = async () => {
            setLoading(true);
            try {
                const res = await fetch('/api/listings', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                const data = await res.json();

                if (data.success === false) {
                    setError(data.error);
                    setLoading(false);
                    return;
                }

                setListings(data);
                setLoading(false);

            } catch (error) {
                setError(error.message || 'An error occurred');
                setLoading(false);
            }
        };

        fetchListings();

    }, []);

    const loadMoreListings = () => {
        setVisibleListings(prev => prev + 5); // Increase by 5 when "View More" is clicked
    };

    if (loading) return <Loader/>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h3>Popular Posts</h3>
            <div className="row g-3 mb-3">
                {listings.slice(0, visibleListings).map((listing) => (
                    <div className="col-md-4" key={listing._id}>
                        <Link to={`/listing/${listing._id}`} className="text-decoration-none">
                            <div
                                className="card card-hover"
                                style={{
                                    borderRadius: '5px',
                                    overflow: 'hidden',
                                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.3)',
                                    height: '100%' // Ensure card height is uniform
                                }}
                            >
                                {listing.imageUrls && listing.imageUrls.length > 0 && (
                                    <div className="card-img-wrapper" style={{ position: 'relative' }}>
                                        <img
                                            className="card-img-top"
                                            src={listing.imageUrls[0]}
                                            alt={`${listing.make} ${listing.model}`}
                                            style={{
                                                height: '200px',
                                                objectFit: 'cover',
                                                width: '100%',
                                                transition: 'transform 0.5s ease'
                                            }}
                                        />
                                    </div>
                                )}
                                <div className="card-body d-flex flex-column" style={{ flex: 1 }}>
                                    <h5 className="card-title mb-3 capitalize">
                                        {`${listing.make} ${listing.model}`}
                                    </h5>
                                    <div className="d-flex align-items-center mb-2">
                                        <FaMapMarkerAlt className="me-2 icon-color-location" />
                                        <p className="mb-0 capitalize">{listing.sellerAddress}</p>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <FaCalendarAlt className="me-2" />
                                        <p className="mb-0 capitalize">{listing.year}</p>
                                    </div>
                                    <div className="d-flex align-items-center mb-2">
                                        <FaDollarSign className="me-2 icon-color-price" />
                                        <p className="mb-0 capitalize">{listing.price.toLocaleString()} PKR</p>
                                    </div>
                                    <div className="d-flex mb-3">
                                        <div className="d-flex align-items-center me-3">
                                            <FaCar className="me-2" />
                                            <p className="mb-0 capitalize">{listing.condition}</p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <FaCogs className="me-2" />
                                            <p className="mb-0 capitalize">{listing.transmission}</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AllListings;
