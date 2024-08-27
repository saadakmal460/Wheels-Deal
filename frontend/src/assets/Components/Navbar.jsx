import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { signOutStart, signOutSucess, signOutFailure } from '../../Redux/User/UserSlice';
import { FaList, FaUserEdit, FaUserTimes, FaSignOutAlt, FaSignInAlt, FaHome, FaPlus, FaBars } from 'react-icons/fa'; // Import FaBars for burger button
import SideBar from './SideBar';
import Loader from './Loader';

const Navbar1 = () => {
    const { currentUser, loading } = useSelector((state) => state.user);
    const [user, setUser] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for sidebar visibility
    const location = useLocation(); // Hook to get the current location
    const dispatch = useDispatch();

    useEffect(() => {
        const resolveUser = async () => {
            if (currentUser && currentUser instanceof Promise) {
                const result = await currentUser;
                setUser(result);
            } else {
                setUser(currentUser);
            }
        };
        resolveUser();
    }, [currentUser]);

    useEffect(() => {
        // Close sidebar on route change
        setIsSidebarOpen(false);
    }, [location]);

    const handleLogOut = async () => {
        try {

            
            dispatch(signOutStart());

            const res = await fetch('/api/signOut');

            if (!res.ok) {
                console.log(res);
                const errorData = await res.json();
                dispatch(signOutFailure(errorData.error));
                return;
            }

            const data = await res.json();

            if (data.success === false) {
                dispatch(signOutFailure(data.error));
                return;
            }

            dispatch(signOutSucess());

        } catch (error) {
            dispatch(signOutFailure(error.message));
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        // Close sidebar when clicking outside
        const handleClickOutside = (event) => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar && !sidebar.contains(event.target) && isSidebarOpen) {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isSidebarOpen]);

    if(loading) return <Loader/>

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary navContainer">
                <Container fluid>
                    <Navbar.Brand href="#">
                        WHEELS DEAL
                    </Navbar.Brand>

                    <div className="d-flex align-items-center ms-auto">
                        {user ? (
                            <>
                                <button
                                    type="button"
                                    className="d-flex align-items-center p-2 me-3"
                                    onClick={toggleSidebar} // Toggle sidebar on click
                                >
                                    <FaBars />
                                </button>

                                <SideBar
                                    isOpen={isSidebarOpen}
                                    toggleSidebar={toggleSidebar}
                                    handleLogOut={handleLogOut}
                                />
                            </>
                        ) : (
                            <Nav style={{ maxHeight: '100px' }} navbarScroll>
                                <Nav.Link as={Link} to="/signIn" className="me-3 d-flex align-items-center">
                                    <FaSignInAlt className="me-2" /> Sign In
                                </Nav.Link>
                            </Nav>
                        )}
                    </div>
                </Container>
            </Navbar>
            {/* Pass state and toggle function */}
        </>
    );
}

export default Navbar1;
