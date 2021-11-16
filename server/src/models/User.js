const mongoose = require('mongoose')
const  bcrypt = require('bcryptjs')
const userShcema =new mongoose.Schema({ //will tell about diffrent data the every user will have in colloection
email: {
    type: String,
    unique: true,
    required: true
},
password:{
    type: String,
    required: true
    
}
})

//pre-safe hook: make sure that we always hash and salt a password when creat new user and store in DB 
userShcema.pre('save',function(next){ //run before save an instance of a user into our DB
    const user = this
    if(!user.isModified('password')){
        return next();
    }
//genarate salt and pass then hash them
//10: how complex salt is it 
bcrypt.genSalt(10, (err,salt) => { 
if(err){
    return next(err)
}
bcrypt.hash(user.password, salt, (err,hash) => {
    if(err){
        return next(err)
    }
    user.password= hash;
    next();
 })
})
})

//candidatePassword: passwordd which the user enter
userShcema.methods.comparePassword = function(candidatePassword){
    const user = this
return new Promise((resolve, reject) => { // promise we pass it a call backfunction, it invoked with 2 arguments resolve and reject, resolve: if the code behaves as expected else reject 
    bcrypt.compare(candidatePassword, user.password, (err, isMatch) => {
    if (err){
        return reject(err)
    }
    if(!isMatch){
        return reject(false)
    }
    resolve(true)
})
})

}
mongoose.model('User', userShcema)