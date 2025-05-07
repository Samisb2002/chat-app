import React, { useEffect } from 'react'
import Navbar from './components/navbar.jsx'
import { Routes ,Route} from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
// import axios from 'axios'
// import { axiosInstance } from './lib/axios.js'
import { useAuthStore } from '../store/useAuthStore.js'



const App = () => {
  const{authUser,checkAuth,isChekingAuth}=useAuthStore();

  useEffect(()=>{
    checkAuth()
  },[checkAuth]);

  console.log({authUser});

  if(isChekingAuth)

  return (
    <div>
      <Navbar/>

      <Routes>
        <Route path='/'element={<HomePage/>}/>
        <Route path='/signup'element={<SignUpPage/>}/>
        <Route path='/login'element={<LoginPage/>}/>
        <Route path='/settings'element={<SettingsPage/>}/>
        <Route path='/profile'element={<ProfilePage/>}/>

      </Routes>
    </div>


  )
}

export default App