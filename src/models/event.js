const moongoose=require("mongoose");

const EventSchema=new moongoose.Schema({
    name:{
        type:String,
        required:true
    },
    venue:{
        type:String,
        required:true
    },
    time:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    img:{
        data:Buffer,
        contentType:String
    },
    price:{
        type:Number,
        required:true
    },
    numberOfTickets:{
        type:Number,
        required:true
    }
})

const Event=new moongoose.model("Event",EventSchema);

module.exports=Event;