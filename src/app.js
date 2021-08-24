const port= process.env.PORT||3000;

const express=require('express');
const app=express();
const path=require("path");
require('./db/conn');
const hbs=require("hbs");

const Register=require("./models/register");
const Event=require("./models/event");
const BookEvent=require("./models/bookEvent");
const middleware = require('./middleware');
const bcrypt = require('bcrypt');


const rounds = 10

const jwt = require('jsonwebtoken')
const tokenSecret = "my-token-secret"

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

//to register a user
app.post("/register",async (req,res)=>{
    try{
        console.log(req.body);
        //to encrypt the password
        bcrypt.hash(req.body.pass,rounds,(error,hash)=> {
            if(error)
                res.status(500).json(error)
            else{
                const registerUser=new Register({
                    name:req.body.name,
                    mail:req.body.mail,
                    pass:hash
                })
                //to save the user
                const register = registerUser.save();
                res.status(201).render("index");
            }
        })
        
    }catch(err){
        res.status(400).send(err);
    }
})

//to generate jwt token for user authentication
function generateToken(user){
    return jwt.sign({data:user}, tokenSecret, {expiresIn: '24h'})
}

//to login the user
app.post("/login",async (req,res)=>{
    res.setHeader('Content-Type', 'application/json');
    try{
        console.log(req.body);
        
        const email=req.body.mail;
        const password=req.body.pass;
        //to check if the user exists using email id
        await Register.findOne({mail:email}).then(user =>{
            if(!user)
                res.status(404).json({error: 'no user with the email found'})
            else{
                //to check if the password is correct
                bcrypt.compare(req.body.pass, user.pass, (error, match)=>{
                    if(error)
                        res.status(500).json(error)
                    else if(match)
                    {
                        user.token=generateToken(user);
                        Register.findOneAndUpdate({mail:email},{token:user.token});
                        const tk=Register.findOne({mail:email});
                        res.status(200).json(user)
                        //res.status(201).render("index");
                    }
                        
                    else   
                        res.status(403).json({error:"password is incorrect"})
            })
        }
        });
    }catch(err){
        res.status(400).send(err);
    }
})

//to create an event
app.post("/create-event",async (req,res)=>{
    try{
        console.log(req.body);
        //object for creating an event
        const createEvent=new Event({
            name:req.body.name,
            venue:req.body.venue,
            time:req.body.time,
            description:req.body.description,
            img:req.body.img,
            price:req.body.price,
            numberOfTickets:req.body.numberOfTickets
        })
        //to save an event
        const event=await createEvent.save();
        res.status(201).send('success');
    }catch(err){
        res.status(400).send(err);
    }
})

//to get an event by name
app.post("/get-event",async (req,res)=>{
    try{
        console.log(req.body);
        
        const name=req.body.name;
        //to find the event by name
        const eventname= await Event.findOne({name:name});
        //to display details of the event
        res.status(201).send({name:eventname.name,venue:eventname.venue,time:eventname.time,img:eventname.img,description:eventname.description,price:eventname.price,numberOfTickets:eventname.numberOfTickets});
    }catch(err){
        res.status(400).send(err);
    }
})

//to delete event by name
app.post("/delete-event",async (req,res)=>{
    try{
        console.log(req.body);

        const name=req.body.name;
        //to delete event by name
        const eventname= await Event.deleteOne({name:name});
        res.status(201).send("event deleted");
    }catch(err){
        res.status(400).send(err);
    }
})

//to update event by name
app.post("/update-event",async (req,res)=>{
    try{
        console.log(req.body);
        
        const name=req.body.name;
        const venue=req.body.venue;
        const time=req.body.time;
        const description=req.body.description;
        const img=req.body.img;
        const price=req.body.price;
        const numberOfTickets=req.body.numberOfTickets;
        //to find an event by name and update it
        const eventname= await Event.findOneAndUpdate({name:name},{venue:venue,time:time,decription:description,price:price,img:img,numberOfTickets:numberOfTickets});
        res.status(201).send("updated");
    }catch(err){
        res.status(400).send(err);
    }
})

//to book an event
app.post("/book-event", middleware.verify, async(req, res) => {
    try{
        const name = req.body.name;
        const event = await Event.findOne({name:name});
        
         const notic = event.numberOfTickets;
        //to check if tickets are available
        if(notic>0)
        {
            //to reduce the number of tickets if available
            numberOfTickets = notic - 1;
            console.log(numberOfTickets)
            //upating the number of tickets in the event
            const eventname= await Event.findOneAndUpdate({name:name},{numberOfTickets:numberOfTickets});
            //object for booked event
            const bookedevent=new BookEvent({
                username:req.user.name,
                eventname:req.body.name,
            })
            //saving the booked event
            const booked = bookedevent.save();
            console.log(booked);
            return res.status(201).send("updated");
        }else{
            return res.status(405).send("Tickets are sold");
        }
        
    }catch(err){
        return res.status(400).send(err);
    }
})



app.listen(port,()=>{
    console.log("server is up")
});