const moongoose=require("mongoose");

const BookEventSchema=new moongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    eventname:{
        type:String,
        required:true,
    }
})

const BookEvent=new moongoose.model("Book Event",BookEventSchema);

module.exports=BookEvent;