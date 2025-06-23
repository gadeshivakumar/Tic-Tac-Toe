require('dotenv').config();
const express=require('express')
const mongo=require('mongoose')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const bp=require('body-parser')
const cors=require('cors')
const {Server}=require('socket.io')
const http=require('http')
const map =require('./users')
const app=express()
const server=http.createServer(app);
const path=require('path')
const ck=require('cookie-parser')
const io= new Server(server,{
    cors:{
    origin:"https://tic-tac-toe-xu3n.onrender.com",
    credentials:true
    }
});
app.use(ck())
app.use(express.urlencoded({extended:true}))
app.use(bp.json())
app.use(cors({
    origin:"https://tic-tac-toe-xu3n.onrender.com",
    credentials:true
}))


// app.use(express.static(path.resolve(__dirname,"../frontend/public")))
const distPath = path.resolve(__dirname, "../frontend/dist");
app.use(express.static(distPath));

io.use((socket,next)=>{
    const token=socket.handshake.auth.token;
    console.log(token);
    if(token!=null){
        jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
            if(err){
                next(new Error("Unauthorized"));
            }
            socket.phone=payload.phone
            socket.name=payload.name
            next();
        });
    }
    else{
    next(new Error("Unauthorized"));
    }
})



mongo.connect(process.env.MONGO_URL)
    .then(()=>{
        console.log("MongoDB connected");
    })
    .catch((err)=>{
        console.log('error while connecting to db',err);
        
    })

const schema=new mongo.Schema({
    name:String,
    phone:String,
    password:String,
})

const user=mongo.model('User',schema);

function check(arr){
        
        if(arr[0]==arr[1] && arr[1]==arr[2] && arr[0]!==""){
            return [0,1,2]
        }
        else if(arr[3]==arr[4] && arr[4]==arr[5] && arr[5]!==""){
            return [3,4,5]
        } 
        else if(arr[6]==arr[7] && arr[8]==arr[7] && arr[7]!==""){
            return [6,7,8]
      
        }
        else if(arr[0]==arr[3] && arr[3]==arr[6] && arr[6]!==""){
            return [0,6,3]
            
        }
        else if(arr[1]==arr[4] && arr[4]==arr[7] && arr[7]!==""){
            return [1,4,7]
            
        }
        else if(arr[2]==arr[5] && arr[5]==arr[8] && arr[8]!==""){
            return [2,5,8]
            
        }
        else if(arr[0]==arr[4] && arr[4]==arr[8] && arr[8]!==""){
            return [0,4,8]
            
        }
        else if(arr[2]==arr[4] && arr[4]==arr[6] && arr[6]!==""){
            return [2,4,6]           
        }
        else{
            return -1
        }
    }

io.on('connection',(socket)=>{

    socket.on('setNum',()=>{
        map.set(socket.phone,socket.id);
    })

    socket.on('findPlayer',async ({phone})=>{
        if(map.has(phone)){
            const u=await user.findOne({phone:phone});
            socket.emit('connected',{name:u.name});
            socket.opponent=phone;
        }
        else{
            socket.emit('noMatch')
        }
    })

    socket.on('CheckWin',({temp})=>{
        const x=check(temp);
        console.log(x[0]);
        if(x!==-1){
            socket.emit('won',{x:x,st:temp[x[0]]});
            io.to(map.get(socket.opponent)).emit('won',{x:x,st:temp[x[0]]})
        }
        else{
            let c=0;
            for(let i=0;i<9;i++){
                if(temp[i]!=""){
                    c+=1;
                }
            }
            if(c==9){
                socket.emit('draw');
                io.to(map.get(socket.opponent)).emit('draw')
            }
                        
        }

        io.to(map.get(socket.opponent)).emit('changes',{arr1:temp});        
    })

    socket.on('disconnect',()=>{
        if(socket.opponent){
            io.to(map.get(socket.opponent)).emit('disconnected');
            map.delete(socket.opponent);
        }
        if(socket.phone){
            map.delete(socket.phone)
            // socket.emit('disconnected')
        }
    })  

    console.log(map);

})

function authorize(req,res,next){
    const token=req.cookies.tokens;
    if(token!=null){
        jwt.verify(token,process.env.SECRET_KEY,(err,payload)=>{
            if(err){
                next(new Error("Unauthorized"));
            }
            req.phone=payload.phone
            req.name=payload.name
            next();
        })
    }
    else{
    next(new Error("Unauthorized"));
    }
}

app.get("/getName",authorize,(req,res)=>{
    res.status(200).json({name:req.name})
})


app.post("/register",async (req,res)=>{
    
    const {name,phone,password}=req.body

    const u=await user.findOne({phone:phone});
    if(u){
       return  res.status(401).send("Try agin");
    }
    const newUser=await new user({
        name,
        password:await bcrypt.hash(password,10)
        ,phone});

    if(newUser){
        await newUser.save();
        res.status(200).send("Registered");
    }
    else{
        res.status(500).send("Server Error");
    }

})

app.post("/login",async(req,res)=>{
    const {phone,password}=req.body
    const u=await user.findOne({phone:phone})
    if (!phone || !password){
       return  res.status(400).send("password required");
    }
    if(!u){
        return res.status(404).send("user not found");
    }

    bcrypt.compare(password,u.password)
    .then(()=>{
        req.phone=phone;
        req.uname=u.name;
        const token=jwt.sign({phone:phone,name:u.name},process.env.SECRET_KEY);
        res.cookie("tokens",token,{
            maxAge: 10*24*60*60*1000,
            // httpOnly: true,
            // secure: true,
        })
        return res.status(200).send();
    })
    .catch(()=>{
        return res.status(404).send("user not found");
    }
    )
})

app.get("/islogin",authorize,(req,res)=>{
    if(req.phone){
      return res.status(200).send("logged in");
    }
    else{
        return res.status(401).send("not logged in");
    }
}
)

app.get("/logout",(req,res)=>{

    res.clearCookie('tokens',{
            maxAge: 10*24*60*60*1000,
            // httpOnly: true,
            // secure: true,
        });
    console.log("done");
    res.status(200).send();

})



const PORT=process.env.PORT || 5000

server.listen(PORT,()=>{
    console.log(`http server stated at port ${PORT}`)
})