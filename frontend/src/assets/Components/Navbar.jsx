import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import { signOutStart, signOutSucess, signOutFailure } from '../../Redux/User/UserSlice';

const Navbar1 = () => {
    const { currentUser, loading, error } = useSelector((state) => state.user);
    const [user, setUser] = useState(null);

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


    const handleLogOut = async () => {
        try {
            dispatch(signOutStart());

            const res = await fetch('/api/signOut');

            if (!res.ok) {
                console.log(res)
                const errorData = await res.json();
                dispatch(signOutFailure(errorData.error));
                return;
            }

            const data = await res.json();

            if (data.sucess === false) {

                dispatch(signOutFailure(data.error));
                return;
            }

            dispatch(signOutSucess());

        } catch (error) {
            dispatch(signOutFailure(data.error));
        }
    }

    return (
        <Navbar expand="lg" className="bg-body-tertiary navContainer">
            <Container fluid>
                <Navbar.Brand href="#">NAPAK WHEELS</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
                        <Nav.Link as={Link} to="/" className="me-3">Home</Nav.Link>
                        <Nav.Link as={Link} to="/about" className="me-3">About</Nav.Link>
                        {user ? (
                            <Nav.Link as={Link} to="/listing" className="me-3">Add Your Post</Nav.Link>
                        ) : <></>}
                    </Nav>
                    {user ? (
                        <Dropdown align="end" className="ms-3">
                            <Dropdown.Toggle
                                as={Nav.Link}
                                className="d-flex align-items-center"
                                id="dropdown-custom-components"
                            >
                                <img
                                    className='rounded-full h-7 w-7 object-cover'
                                    src={user.avatar}
                                    alt='Profile'
                                />
                            </Dropdown.Toggle>
                            <Dropdown.Menu className="dropdown-menu-right">
                            <Dropdown.Item as={Link} to="/myListings">My Listings</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/editProfile">Edit Profile</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/profile">Delete Profile</Dropdown.Item>
                                <Dropdown.Item onClick={handleLogOut}>{loading ? 'Signing Out' : 'Sign Out'}</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    ) : (
                        <Nav style={{ maxHeight: '100px' }} navbarScroll>
                            <Nav.Link as={Link} to="/signIn" className="me-3">Sign In</Nav.Link>
                        </Nav>
                    )}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Navbar1;
