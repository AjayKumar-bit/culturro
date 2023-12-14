const express = require("express")
const model = require("../model/model.js")
const getUser = require("../model/getUser")


const router= express.Router()


router.post('/register',async(req,res)=>{
    const data= await model.tokenData(req.body,res)
    res.json(data)
})

router.get('/' , getUser,async(req,res)=>{
    const result=await model.getAllBook()
    res.json(result)
})

// router.get('/a' , async(req,res)=>{
//     const result=await model.getAllBook()
//     res.json(result)
// })

router.get('/:name' , async(req,res)=>{
    // console.log(req.params.name)
    const result=await model.getBookByName(req.params.name)  
    res.json(result)
})

router.post('/' , async(req,res)=>{
    const result=await model.addBook(req.body)
    res.json(result)
})

router.put('/' , async(req,res)=>{
    const result=await model.editBookDetails(req.params.book,req.params.author,req.body)
    res.json(result)
})

router.delete('/:book/:author/:published' , async(req,res)=>{
    const result=await model.deleteBook(req.params.book,req.params.author,req.params.published)
    res.json(result)
})



module.exports=router