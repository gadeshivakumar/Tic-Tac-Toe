import React, { useEffect, useState,useRef } from 'react'
import Board from './Board'
import { io } from "socket.io-client";
import './Connect.css'
import { useLocation } from 'react-router-dom';
import Player from './Player';
import { useMemo } from 'react';
export default function Game() {
    const [arr,setArr]=useState(["","","","","","","","",""])
    const [status,setStatus]=useState("");
    const socket=useRef(null);
    const [player,setPlayer]=useState({name:"",f:false})
    const [conReq,setConReq]=useState(true)
    const [num,setNum]=useState("")
    const [myTurn,setMyTurn]=useState(true)
    const [reconnect,setReconnect]=useState(false)

    const token=useMemo(()=>{
        const t=document.cookie.split("; ");
        for(let i of t){
            let [key,val]=i.split("=");
            if(key==="tokens"){
                return val;
            }
        }
        return null;
    },[])
    function handleClick(ind){
            if(status=="" && arr[ind]==="" && myTurn){
            const turn=arr.filter((a)=>a!=="").length;
            const sym=turn%2==0?'❌':'⭕';
            const temp=arr.map((i)=>i);
            temp[ind]=sym;
            setArr(temp) 
            setMyTurn(false)
            socket.current.emit("CheckWin",{temp:temp})
            }
    }

    function reset(){
        setArr(["","","","","","","","",""])
        setStatus("")
    }
    
    function handleConnect(){
        socket.current.emit('findPlayer',{phone:num})
    }
    
    useEffect(()=>{

        socket.current=io('https://tic-tac-toe-xu3n.onrender.com/',{
            auth:{
                token:token
            },
            withCredentials:true,
        });
        setReconnect(false)
        socket.current.on('connect',()=>{
            socket.current.emit("setNum");
            console.log("connected")
        })

        socket.current.on('noMatch',()=>{
            setConReq(true)
        })
        socket.current.on('connected',({name})=>{
            setPlayer({name:name,f:true})
            setConReq(false);
            console.log("connected",name);
        })

        socket.current.on('draw',()=>{
            setStatus("draw")
            setTimeout(()=>{
                // setConReq(true)
                reset();
            },3000);
        })

        socket.current.on('won',({x,st})=>{
            setStatus(st);
            setTimeout(()=>{
                reset();
            },3000);
        })

        socket.current.on('changes',({arr1})=>{
            setMyTurn(true);
            setArr(arr1);  
        })

        socket.current.on('disconnected',()=>{
            setReconnect(true);
        })

        socket.current.on('disconnect',()=>{
            setConReq(true)
            reset();
            setPlayer({})
            setReconnect(true);
        })

        return ()=>{
            if(socket.current){
                socket.current.disconnect();
            }
        }

    },[reconnect,token])

    function onDisconnect(){
        if(socket.current)
        socket.current.disconnect();
    }

    
    return (
       
    <div className="game-container">
    { conReq ?
        <>
        <div className="connect-box">
            <h2 className="connect-title">Connect</h2>
            <input
            type="tel"
            placeholder="Enter phone number"
            className="connect-input"
            onChange={(e) => setNum(e.target.value)}
            />
            <button className="connect-button" onClick={handleConnect}>Connect</button>
        </div>
        </> :

        <Player name={player.name} onDisconnect={onDisconnect}/>

        }
      
        
      <div className="game-area">
        <Board arr={arr} handleClick={handleClick} />
        {status && <h1 className="status-text">Winner: {status}</h1>}
      </div>
    </div>
  )
}




