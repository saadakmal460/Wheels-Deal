import React, { useEffect  , useState} from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar1 = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [user, setUser] = useState(null);

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


    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary navContainer">
                <Container fluid className=''>
                    <Navbar.Brand href="#">REAL ESTATE</Navbar.Brand>
                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/about">About</Nav.Link>


                            <Nav.Link as={Link} to="/profile">

                                {user ? (<img className='rounded-full h-7 w-7 object-cover' src={user.avatar} alt='' />) : 'SignIn'}

                            </Nav.Link>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Search"
                                className="me-2 search"
                                aria-label="Search"
                            />
                            <Button variant="secondary">Search</Button>
                        </Form>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    );
}

export default Navbar1;
