const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");


//CREATING MIDDLEWARE TO FETCH USER
const fetchUser = async(req,res, next)=>{
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({errors:"Please authenticate using valid token"});
    }
    else{
        try {
            const data = jwt.verify(token,JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
          res.status(401).send({error:"Please authenticate using valid tokene"})  
        }
    }
}

module.exports = fetchUser;