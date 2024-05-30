const mongoose = require('mongoose')
const {Schema} = mongoose;

const userSchema = new Schema({
    username:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    dob:{
        type:Date,
    },
    googleid:{
        type:String
    },
    googleAccessToken:String,
    image:String
})


module.exports = mongoose.model('users',userSchema);