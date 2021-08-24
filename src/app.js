const express=require('express');
const app=express();
const path=require("path");
const port= process.env.PORT||3000;
require('./db/conn');
const hbs=require("hbs");
const Register=require("./models/register");
const Event=require("./models/event");

const static_path=path.join(__dirname,"../public");
const templates_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");

app.use(express.json());
//app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine","hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("register");
})

app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/login",(req,res)=>{
    res.render("login");
})

app.post("/register",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const registerUser=new Register({
            name:req.body.name,
            mail:req.body.mail,
            pass:req.body.pass
        })
        const register=await registerUser.save();
        res.status(201).render("index");
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/login",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const email=req.body.mail;
        const password=req.body.pass;
        const useremail= await Register.findOne({mail:email});
        if(useremail.pass===password){
            res.status(201).render("index");
        }
        else{
            res.send('wrong password');
        }
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/create-event",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const createEvent=new Event({
            name:req.body.name,
            venue:req.body.venue,
            time:req.body.time,
            description:req.body.description,
            img:req.body.img,
            price:req.body.price,
            numberOfTickets:req.body.numberOfTickets
        })
        const event=await createEvent.save();
        res.status(201).send('success');
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/get-event",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const name=req.body.name;
        const eventname= await Event.findOne({name:name});
        res.status(201).send({name:eventname.name,venue:eventname.venue,time:eventname.time,img:eventname.img,description:eventname.description,price:eventname.price,numberOfTickets:eventname.numberOfTickets});
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/delete-event",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const name=req.body.name;
        const eventname= await Event.deleteOne({name:name});
        res.status(201).send("event deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

app.post("/update-event",async (req,res)=>{
    try{
        console.log(req.body);
        //res.send(req.body)
        const name=req.body.name;
        const venue=req.body.venue;
        const time=req.body.time;
        const description=req.body.description;
        const img=req.body.img;
        const price=req.body.price;
        const numberOfTickets=req.body.numberOfTickets;
        const eventname= await Event.findOneAndUpdate({name:name},{venue:venue,time:time,decription:description,price:price,img:img,numberOfTickets:numberOfTickets});
        res.status(201).send("updated");
    }catch(err){
        res.status(400).send(err);
    }
})

app.listen(port,()=>{
    console.log("server is up")
});