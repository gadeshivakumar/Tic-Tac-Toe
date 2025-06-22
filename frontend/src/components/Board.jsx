import React from 'react';
import './board.css';

export default function Board({ arr, handleClick }) {
  return (
    <div id="board">
      {arr.map((a, index) => (
        <button className="cell" key={index} onClick={() => handleClick(index)}>
          {a}
        </button>
      ))}
    </div>
  );
}
