const serverConfig=require('./serverConfig')
const mongoose=require('mongoose')

const connectDB=async()=>{
    try{
        await mongoose.connect(serverConfig.DB_URL)
        console.log('Database connected successfully')
    }catch(err){
        console.log('Database connection failed')
        console.log(err)
        process.exit(1)
    };
}

module.exports=connectDB