const jwt = require("jsonwebtoken"); 
const { JWT_SECRET } = require("./config");
const authmiddleware = (req,res,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({})
        
    }
    const token  = authHeader.split(' ')[1];
    console.log(token);
    try {
        const decoded = jwt.verify(token,JWT_SECRET)
        console.log(decoded.userId);
        if(decoded.userId){
            console.log("hell");
            req.userId = decoded.userId
            console.log("next");
            next();
        }
    } catch (err) {
        return res.status(403).json({
            msg:"sorry"
        })
        
    }
}

module.exports = authmiddleware