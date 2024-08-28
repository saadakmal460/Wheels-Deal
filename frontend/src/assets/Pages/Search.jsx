import React, { useState, useEffect, useRef } from 'react';
import {
  FaFilter,
  FaSearch,
  FaDollarSign,
  FaCar,
  FaCogs,
  FaGasPump,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTimesCircle
} from 'react-icons/fa';
import Loader from '../Components/Loader'; // Assume you have a Loader component
import { Link } from 'react-router-dom';
import { Slider } from '@mui/material';

const Search = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000000000000]);
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState([]);

  const modalRef = useRef(null);

  // Update the applied filters based on current filter values
  useEffect(() => {
    const filters = [];
    if (searchQuery) filters.push(`Search: ${searchQuery}`);
    if (priceRange[0] !== 0 || priceRange[1] !== 5000000000000)
      filters.push(`Price: $${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`);
    if (condition) filters.push(`Condition: ${condition}`);
    if (transmission) filters.push(`Transmission: ${transmission}`);
    if (fuelType) filters.push(`Fuel Type: ${fuelType}`);
    if (location) filters.push(`Location: ${location}`);
    if (year) filters.push(`Year: ${year}`);

    setAppliedFilters(filters);
  }, [searchQuery, priceRange, condition, transmission, fuelType, location, year]);

  // Toggle the filter modal
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle clicks outside of the modal
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      toggleFilters();
    }
  };

  // Add event listener to handle clicks outside of the modal
  useEffect(() => {
    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  // Handle changes to price range slider
  const handleChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Function to fetch filtered listings from backend
  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchQuery,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        condition,
        transmission,
        fuelType,
        location,
        year,
      }).toString();

      console.log('Fetching with query:', query);

      const res = await fetch(`/api/filtered/listings?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();
      if (data.success === false) {
        console.log(data.error);
        setListings([]);
      } else {
        setListings(data.data);
        console.log(data); // Log the results for debugging
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle real-time search and filter updates
  useEffect(() => {
    fetchListings();
  }, [searchQuery, priceRange, condition, transmission, fuelType, location, year]);

  // Handle removal of applied filters
  const handleRemoveFilter = (filter) => {
    const updatedFilters = appliedFilters.filter(f => f !== filter);
    setAppliedFilters(updatedFilters);

    // Update state based on the filter being removed
    if (filter.startsWith('Search:')) setSearchQuery('');
    if (filter.startsWith('Price:')) setPriceRange([0, 5000000000000]);
    if (filter.startsWith('Condition:')) setCondition('');
    if (filter.startsWith('Transmission:')) setTransmission('');
    if (filter.startsWith('Fuel Type:')) setFuelType('');
    if (filter.startsWith('Location:')) setLocation('');
    if (filter.startsWith('Year:')) setYear('');
  };

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchClick = () => {
    fetchListings();
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    fetchListings();
  };

  return (
    <>
      <div className="relative w-full flex flex-col items-center p-4">
        {/* Search Bar */}
        <div className="flex items-center justify-center w-full max-w-screen-md bg-white shadow-md rounded-md p-2 mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            className="flex-grow px-4 py-2 text-lg rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            placeholder="Search..."
          />
          <button
            onClick={handleSearchClick}
            className="p-2 ml-2 bg-custom-blue text-white rounded-md hover:bg-blue-hover"
          >
            <FaSearch />
          </button>
          <button
            onClick={toggleFilters}
            className="p-2 ml-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <FaFilter className="text-gray-600" />
          </button>
        </div>

        {/* Applied Filters Section */}
        <div className="flex flex-wrap gap-2 p-2 w-full max-w-screen-md mx-auto">
          {appliedFilters.length > 0 ? (
            appliedFilters.map((filter, index) => (
              <div key={index} className="bg-gray-200 px-3 py-1 flex items-center rounded-md text-sm">
                <span className="capitalize">{filter}</span>
                <button
                  onClick={() => handleRemoveFilter(filter)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <FaTimesCircle />
                </button>
              </div>
            ))
          ) : (
            <div className="w-full text-center text-gray-500">No filters applied</div>
          )}
        </div>
      </div>

      {/* Modal for Filters */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div
          ref={modalRef}
          className="bg-white w-3/4 md:w-1/2 lg:w-1/3 p-4 rounded-md shadow-lg"
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center">
            <FaFilter className="mr-2 text-blue-500" /> Filter Options
          </h4>
      
          {/* Price Filter with Slider */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaDollarSign className="mr-2 text-green-500" />
              Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
            </label>
            <Slider
              value={priceRange}
              onChange={handleChange}
              valueLabelDisplay="auto"
              min={0}
              max={5000000}
              step={1000}
              aria-labelledby="price-range-slider"
              getAriaLabel={() => 'Price range'}
            />
          </div>
      
          {/* Condition Filter */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaCar className="mr-2 text-red-500" /> Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            >
              <option value="">Select Condition</option>
              <option value="new">New</option>
              <option value="used">Used</option>
              <option value="certified">Certified</option>
            </select>
          </div>
      
          {/* Transmission Filter */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaCogs className="mr-2 text-gray-600" /> Transmission
            </label>
            <select
              value={transmission}
              onChange={(e) => setTransmission(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            >
              <option value="">Select Transmission</option>
              <option value="automatic">Automatic</option>
              <option value="manual">Manual</option>
            </select>
          </div>
      
          {/* Fuel Type Filter */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaGasPump className="mr-2 text-yellow-500" /> Fuel Type
            </label>
            <select
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
            >
              <option value="">Select Fuel Type</option>
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
            </select>
          </div>
      
          {/* Location Filter */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaMapMarkerAlt className="mr-2 text-blue-500" /> Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
              placeholder="Enter location"
            />
          </div>
      
          {/* Year Filter */}
          <div className="mb-3">
            <label className="block text-gray-700 mb-2 flex items-center">
              <FaCalendarAlt className="mr-2 text-purple-500" /> Year
            </label>
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
              placeholder="Enter year"
            />
          </div>
      
          <div className="flex justify-end">
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-hover"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
      
      )}

      {/* Loader */}
      {loading && <Loader />}
      
      {/* Listings */}
      <div className="container mt-4">
            <h3>Results</h3>
            <div className="row g-3 mb-3">
                {listings.map((listing) => (
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
                                        <p className="mb-0 capitalize">${listing.price.toLocaleString()}</p>
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
    </>
  );
};

export default Search;
