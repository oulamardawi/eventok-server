//middleware function which take incoming request and do some pre-processing on it
// make sure that user includes some token and if they do, we will allow them to access some given route inside the app else reject request and send error

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
const { authorization } = req.headers
//authorization=== 'bearer lakskjdfkjdkfdfdfhdf;
if(!authorization){
    return res.status(401).send({error: 'you must be logged in.'})
}
  

const token = authorization.replace('Bearer ', '')
jwt.verify(token, 'MY_SECRET_KEY', async(err, payload) =>{
if(err){
    return res.status(401).send({ error: 'You must be logged in'})
}

const{ userId } = payload
const user = await User.findById(userId)
req.user = user;
next();


})




}