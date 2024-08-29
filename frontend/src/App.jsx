import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './assets/Pages/Home'
import SignIn from './assets/Pages/SignIn'
import SignUp from './assets/Pages/SignUp'
import Profile from './assets/Pages/Profile'
import Navbar1 from './assets/Components/Navbar';
import PrivateRoute from './assets/Components/PrivateRoute';
import EditProfile from './assets/Pages/EditProfile';
import Listing from './assets/Pages/Listing';
import ShowListings from './assets/Pages/ShowListings';
import UserIndiviualListing from './assets/Pages/UserIndiviualListing';
import EditListing from './assets/Pages/EditListing';
import Search from './assets/Pages/Search';
import SideBar from './assets/Components/SideBar';
import Footer from './assets/Components/Footer';



const App = () => {
  return (
    <BrowserRouter>

      
      <Navbar1 />
      <Routes>
        <Route path='/' element={<Home />} />

        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/editProfile' element={<EditProfile />} />
          <Route path='/listing' element={<Listing />} />
          <Route path='/myListings' element={<ShowListings />} />
          <Route path='/listing/:id' element={<UserIndiviualListing />} />
          <Route path='/editList/:id' element={<EditListing />} />
          <Route path='/search' element={<Search />} />



        </Route>

        <Route path='/signIn' element={<SignIn />} />
        <Route path='/signUp' element={<SignUp />} />
      </Routes>

      <Footer/>

    </BrowserRouter>
  )
}

export default App
