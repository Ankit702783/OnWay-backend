const express = require('express')
const connectDB = require('./config/dbConfig')
const serverConfig = require('./config/serverConfig')
const userRouter = require('./routes/userRouter')
const authRouter = require('./routes/authRouter')

const cors = require('cors')
const cookieParser = require('cookie-parser')
const PORT = serverConfig.PORT  
const app = express()


app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.text());



app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));


 


const path = require('path');


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/users',userRouter)
app.use('/auth',authRouter)


app.get('/hii',(req,res)=>{
  console.log(' /hii route hit');
    return res.json({message:'hello'})

})
app.listen(PORT,async ()=>{
    await connectDB()
    console.log(`Server is running on port ${PORT}`)
})