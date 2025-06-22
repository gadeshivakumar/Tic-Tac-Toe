import React from 'react';
import './Player.css';

export default function Player({ name, onDisconnect }) {
  return (
    <div className="player-card">
      <img 
        src="/Avator.webp" 
        alt={`${name}'s avatar`} 
        onError={
          (e)=>{e.target.onerror=null;
              e.target.src="/Avator.webp"
      }} className="player-dp" />
      <h3 className="player-name">{name}</h3>
      <button className="disconnect-button" onClick={onDisconnect}>
        Disconnect
      </button>
    </div>
  );
}
