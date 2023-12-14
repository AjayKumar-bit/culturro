const jwt=require( 'jsonwebtoken')
const JWT_SECRET="morninglakewake"

const getUser=(req,res,next)=>{
    const token= req.header('auth-token')
    if(!token){
        res.status(401).send({status:false,message:"Authenticate with a valid token"})
    }
    try {
        const data=jwt.verify(token,JWT_SECRET);
        req.user=data.user;
        next();
    } catch (error) {
        res.status(401).json({status:false,message:"Error in fetchuser"})
    }
}


module.exports=getUser;