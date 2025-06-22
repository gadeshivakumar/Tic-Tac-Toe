import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Login from './components/Login'
import Register from './components/Register'
import Game from './components/Game'
import Home from './components/Home'
export default function App() {
  return (
    <div>

      <BrowserRouter>
        
        <Routes>
          
          <Route path="/login" element={<Login/>}/>

          <Route path="/register" element={<Register/>} />

          <Route path="/" element={<LandingPage/>} />

          <Route path="/game" element={<Game/>} />

          <Route path="/home" element={<Home/>} />

          

        </Routes>
      
      </BrowserRouter>
      
    </div>
  )
}
