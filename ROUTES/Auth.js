const express=require('express')
const userModel=require('../model/UserModel')
const router=express.Router()
const bcrypt=require('bcryptjs')
const jwt=require( 'jsonwebtoken')

// const fetchuser=require('../Middleware/fetchuser')


const JWT_SECRET="morninglakewake"




//1.create user in database
router.post('/createuser',async(req,res)=>{
    

    const salt= await bcrypt.genSalt(10);
    const securedPassword= await bcrypt.hash(req.body.password,salt);

    const user={
        "email":req.body.email,
        "name":req.body.name,
        "password":securedPassword 
    }
    const result=await userModel.createUser(user)

    if(result.status){
        const data={
            user:{
                id:result.response
            }
        }
        const authtoken=jwt.sign(data,JWT_SECRET)
        return res.json({status:result.status,authtoken})
    }
    else{
        // res.json(result)
        return res.status(500).json(result)
    }
})

// Route 2: Login existing user
router.post('/login',async(req,res)=>{
    const {email,password}=req.body
    try{
   
        const result=await userModel.getUserByEmail(email)

        if(!result.status){
            return res.status(400).json(result)
        }

        const passwordCompare=await bcrypt.compare(password,result.response.password)
        if(!passwordCompare){
           return  res.status(400).json({status:false,response:"Invalid password"})
        }

        if(result.status){
            const data={
                user:{
                    id:result.id
                }
            }
            const authtoken=jwt.sign(data,JWT_SECRET)
            return res.json({status:result.status,authtoken})
        }
        else{
            return res.status(500).json(result) 
        }

    }
    catch(error){
        return res.status(500).json({status:false,error})
    }  

})








module.exports=router