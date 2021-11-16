//all of our request handling logic to deal with anything related to authntication

const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = mongoose.model('User') //to deal with users stored in mongo

const router = express.Router()

router.post('/signup', async(req, res) => { //to handel recived request 
const { email, password } = req.body

try{
const user = new User({ email, password})
await user.save()

const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY' )
res.send({token})
} catch(err){
  return  res.status(422).send(err.message) //422:invalid data
}
})

router.post('/signin', async (req,res) => {
const { email, password } = req.body //email&pass from request , that write in ui

if( !email || !password){
    return res.status(422).send({error: 'Must provide email and password'})
}

const user = await User.findOne({ email})
if(!user){
    return res.status(422).send({error: 'Email not found'})
}

try{
await user.comparePassword(password) //user.password= hashed salted password in DB, password: the user enter in ui
const token = jwt.sign({userId: user._id}, 'MY_SECRET_KEY') 
res.send({token})
} catch(err){
    return res.status(422).send({error : 'Invalid password or email'})
}
})
module.exports=router