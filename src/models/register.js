const moongoose=require("mongoose");

const userSchema=new moongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    mail:{
        type:String,
        required:true,
        unique:true
    },
    pass:{
        type:String,
        required:true
    }
})

const Register=new moongoose.model("Register",userSchema);

module.exports=Register;