import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './assets/Pages/Home'
import SignIn from './assets/Pages/SignIn'
import SignUp from './assets/Pages/SignUp'
import Profile from './assets/Pages/Profile'
import About from './assets/Pages/About'

import Navbar1 from './assets/Components/Navbar';


const App = () => {
  return (
    <BrowserRouter>
    <Navbar1/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/signIn' element={<SignIn/>}/>
        <Route path='/signUp' element={<SignUp/>}/>
        <Route path='/about' element={<About/>}/>
      </Routes>

    </BrowserRouter>
  )
}

export default App
