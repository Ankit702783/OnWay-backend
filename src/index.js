const express = require('express')
const http = require("http");
const { initSocket } = require("./socket");




const connectDB = require('./config/dbConfig')
const serverConfig = require('./config/serverConfig')
const userRouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter')
const rideRouter = require('./routes/rideRouter')
const riderRouter = require('./routes/riderRouter')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = serverConfig.PORT  
const app = express()

const server = http.createServer(app);

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.text());



app.use(cors({
  origin: [
    'https://on-way.vercel.app',
    'https://on-way-pilot.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174'
  ],
  credentials: true
}));


 


const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/users',userRouter)
app.use('/auth',authRouter)
app.use('/ride',rideRouter)
app.use('/rider', riderRouter);



app.get('/hii',(req,res)=>{
  console.log(' /hii route hit');
    return res.json({message:'hello'})

})
server.listen(PORT, async () => {
  await connectDB();
  initSocket(server);
  console.log(`Server running on ${PORT}`);
});


