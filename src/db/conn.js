const moongoose=require("mongoose");

moongoose.connect('mongodb+srv://jaanbaaz23:jaanbaaz23@cluster0.85imn.mongodb.net/event?retryWrites=true&w=majority',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log('connection successful');
}).catch((e)=>{
    console.log(e);
})
