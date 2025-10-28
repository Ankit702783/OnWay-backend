const dotenv=require('dotenv')


dotenv.config()

module.exports={
    PORT:process.env.PORT,
    DB_URL:process.env.DB_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRY: process.env.JWT_EXPIRY,
    FRONTEND_URL:process.env.FRONTEND_URL,
    COOKIE_SECURE: process.env.NODE_ENV === 'production'
        ? process.env.COOKIE_SECURE === 'true'
        : false,
  
    WEATHER_API_KEY:process.env.WEATHER_API_KEY,
    CLOUDINARY_CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY:process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET:process.env.CLOUDINARY_API_SECRET,

    GMAIL_USER:process.env.GMAIL_USER,
    GMAIL_PASS:process.env.GMAIL_PASS,
    TWILIO_SID:process.env.twilio_account_sid,
    TWILIO_AUTH_TOKEN:process.env.twilio_auth_token,
    TWILIO_PHONE:process.env.twilio_phone

}
