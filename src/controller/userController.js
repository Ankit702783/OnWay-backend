const { registerUser,getUserProfileService  } = require("../services/userService");


async function createUser(req, res) {

    try {
        const response = await registerUser(req.body);
        return res.status(201).json({
            message: 'Successfully registered the user',
            success: true,
            data: response,
            error: {}
        });
    } catch(error) {
       console.log(error)
        return res.status(error.statusCode).json({
            success: false,
            message: error.reason,
            data: {},
            error: error
        })
    }
   
}



async function getUserProfileController(req, res){
  try {
    const user = await getUserProfileService(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getUserProfileController:", error);
    res.status(500).json({ message: "Server error" });
  }
};




module.exports = {
    createUser,getUserProfileController
}