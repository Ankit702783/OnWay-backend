const jwt = require('jsonwebtoken');
const { JWT_SECRET, COOKIE_SECURE} = require('../config/serverConfig');


async function isLoggedIn(req, res, next) {
    
    const token = req.cookies["authToken"];
    console.log("token :",token);
    if(!token) {
        return res.status(401).json({
            success: false,
            data: {},
            error: "Not authenticated ,this error is from isLoggedin",
            message: "No Auth Token provided"
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log("decoded token:",token);
        console.log(decoded, decoded.exp, Date.now() / 1000);

        if(!decoded) {
            throw new UnAuthorisedError();
        }
        

        req.user = {
            email: decoded.email,
            id: decoded.id,
           
        }

        next();
    } catch (error) {
        console.log(error.name);
        if(error.name === "TokenExpiredError") {
            res.cookie("authToken", "", {
                httpOnly: true,
                sameSite: "None",
                secure: COOKIE_SECURE,
                maxAge: 7 * 24 * 60 * 60 * 1000,
               
            });
            return res.status(200).json({
                success: true,
                message: "Log out successfull",
                error: {},
                data: {}
            });
        }
        return res.status(401).json({
            success: false,
            data: {},
            error: error,
            message: "Invalid Token provided"
        });
    }
}


module.exports = {
    isLoggedIn
}