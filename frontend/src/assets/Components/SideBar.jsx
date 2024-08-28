import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaPlus, FaList, FaUserEdit, FaUserTimes, FaSignOutAlt, FaUser, FaCrop, FaCross, FaTimes, FaSearch } from 'react-icons/fa'; // Import react-icons

const SideBar = ({ isOpen, toggleSidebar, handleLogOut , img }) => {
    return (
        <div
            className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-e border-gray-200 pt-7 pb-10 overflow-y-auto transition-transform duration-300 sidebar ${isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
        >
            <button
                className="absolute top-4 right-4"
                onClick={toggleSidebar}
            >
                <FaTimes className="text-lg" />
            </button>
            <div className="px-6 mb-3">
                <a
                    className="flex items-center space-x-2 no-underline"
                    href="#"
                >
                    <span className="flex-none font-semibold text-xl text-black no-underline">
                        WHEELS DEAL
                    </span>
                </a>
            </div>
            <nav className="p-6">
                <ul className="space-y-1.5 list">
                <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"
                            to="/editProfile"
                        >
                            <img
                                src={img}   // Replace with actual image path or URL
                                alt="User Profile"
                                className="w-7 h-7 rounded-full object-cover"
                            />
                            
                            Profile
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"
                            to="/"
                        >
                            <FaHome className="text-lg" />
                            Home
                        </Link>
                    </li>
                    
                    <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"
                            to="/search"
                        >
                            
                            <FaSearch className="text-lg" />
                            Find you dream vehicle
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"
                            to="/listing"
                        >
                            <FaPlus className="text-lg" />
                            Add Your Post
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"
                            to="/myListings"
                        >
                            <FaList className="text-lg" />
                            My Listings
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="flex items-center gap-x-3.5 py-2 px-2.5 bg-white text-sm text-black rounded-lg hover:bg-neutral-200 no-underline items"

                            onClick={handleLogOut} // Close sidebar on sign out
                        >
                            <FaSignOutAlt className="text-lg" />
                            Sign Out
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default SideBar;
