import React from "react";
import "./home.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";

const Home = () => {
  const navigator = useNavigate();
  const [name,setName]=useState("");
  function handlePlay() {
    navigator("/game");
  }

  function handleLogout(){
      console.log("clicked")
      fetch("http://localhost:5000/logout",{
        credentials:"include",
      }).then((res)=>{
        if(res.ok){
            navigator('/');
        }
      })
      .catch(err=>{
        console.log(err);
      })
  }

  useEffect(()=>{
    fetch('http://localhost:5000/getName',{
        credentials:"include",
      })
      .then((res)=>{
          return res.json();
      })
      .then(({name})=>{
        setName(name);
      })
      .catch((err)=>{
        console.log(err)
      })
  })


  return (
    <div className="home-container">
      <header className="home-header">
        <img src="/logo.webp" alt="Game Logo" className="logo" />
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <main className="home-main">
        <h1 className="welcome-text">Welcome {name}!</h1>
        <p className="description">Ready to play an exciting match?</p>
        <button className="play-btn" onClick={handlePlay}>
          🎮 Start Game
        </button>
      </main>

      <footer className="home-footer">
        <p>© 2025 GamerzWorld. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
