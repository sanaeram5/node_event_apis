const moongoose=require("mongoose");

moongoose.connect('mongodb+srv://eramsana8:eramsana@123@cluster0.jlggs.mongodb.net/event?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})
