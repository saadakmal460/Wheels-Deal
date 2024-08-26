import React, { useState, useEffect } from 'react';
import {
  FaFilter,
  FaSearch,
  FaDollarSign,
  FaCar,
  FaCogs,
  FaGasPump,
  FaMapMarkerAlt
} from 'react-icons/fa';

const Search = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 50000]);
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [location, setLocation] = useState('');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Function to toggle the filter modal
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Handle changes to price range slider
  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value);
    setPriceRange([0, value]);
  };

  // Function to fetch filtered listings from backend
  const fetchListings = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search: searchQuery,
        minPrice: priceRange[0],
        maxPrice: 500000000000000000000,
        condition,
        transmission,
        fuelType,
        location
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
        setListings(data);
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
    if (!showFilters) {
      fetchListings();
    }
  }, [searchQuery, priceRange, condition, transmission, fuelType, location]);

  const handleSearchChange = (e) => setSearchQuery(e.target.value);

  const handleSearchClick = () => {
    fetchListings();
  };

  const handleApplyFilters = () => {
    setShowFilters(false);
    fetchListings();
  };

  return (
    <div className="relative w-full h-56 flex items-center justify-center">
      <div className="absolute top-6 flex items-center w-3/4 md:w-1/2 lg:w-2/5 bg-white shadow-md rounded-md p-1">
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

      {/* Modal for Filters */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-3/4 md:w-1/2 lg:w-1/3 p-4 rounded-md shadow-lg">
            <h4 className="text-lg font-semibold mb-4 flex items-center">
              <FaFilter className="mr-2 text-blue-500" /> Filter Options
            </h4>

            {/* Price Filter with Slider */}
            <div className="mb-3">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaDollarSign className="mr-2 text-green-500" /> Price Range: ${priceRange[0].toLocaleString()} - ${priceRange[1].toLocaleString()}
              </label>
              <input
                type="range"
                min="0"
                max="5000000000000000000000"
                step="1000"
                value={priceRange[1]}
                onChange={handleSliderChange}
                className="w-full focus:ring-2 focus:ring-custom-blue"
              />
            </div>

            {/* Condition Filter */}
            <div className="mb-3">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaCar className="mr-2 text-blue-500" /> Condition
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
                <FaCogs className="mr-2 text-red-500" /> Transmission
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
                <FaGasPump className="mr-2 text-orange-500" /> Fuel Type
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
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Location Filter */}
            <div className="mb-3">
              <label className="block text-gray-700 mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-purple-500" /> Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-custom-blue"
                placeholder="Enter Location"
              />
            </div>

            {/* Apply Filters Button */}
            <button
              onClick={handleApplyFilters}
              className="w-full px-4 py-2 bg-custom-blue text-white rounded-md hover:bg-blue-700"
            >
              Apply Filters
            </button>

            {/* Close Modal Button */}
            <button
              onClick={toggleFilters}
              className="w-full px-4 py-2 mt-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
