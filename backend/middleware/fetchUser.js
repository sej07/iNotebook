//importing jwt
var jwt = require("jsonwebtoken");
const JWT_SECRET = "Thisisa@mernapp";
const fetchUser= (req,res,next)=>{
    //get the user from the jwt token and add id to request object
    const token = req.header("authtoken");
    if(!token){
        res.status(401).send({error:"Enter valid credentials"});
    }
    try {
        const data=  jwt.verify(token ,JWT_SECRET);
        req.user= data.user;
        next();  
    } catch (error) {
       res.status(401).send({error:"Enter valid credentials"});
    }
    
}

module.exports= fetchUser;