require('./models/User')
const express = require('express')
const bodyParser = require('body-parser') //parse the information from the request body and handle incoming json informatio
const mongoose = require('mongoose')
const authRoute= require('./routes/authRoute')
const requireAuth = require('./middlewares/requireAuth')
const app = express()

app.use(bodyParser.json())
app.use(authRoute)

const mongoUri="mongodb+srv://oula:alaa_oula@cluster0.bgcpx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
mongoose.connect(mongoUri,{

    useNewUrlParser: true,
    useUnifiedTopology: true 
})

mongoose.connection.on('connected', ()=>{
console.log('Connected to Mongo instance')
})

mongoose.connection.on('error',(err)=>{
console.error('Error Connected to Mongo instance',err)
})

 
app.get('/', requireAuth, (req,res)=>{
res.send(`your email: ${req.user.email}`)
})

    
app.listen(8080, () => {
console.log("server running")
 
})