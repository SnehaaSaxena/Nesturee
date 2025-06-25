if(process.env.NODE_ENV !="production"){
require('dotenv').config();
}
//console.log(process.env.SECRET);


const express=require("express");
const app=express();
const mongoose=require("mongoose");
//const Listing=require("./models/listings.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
//const wrapAsync=require("./utils/wrapAsync.js");
const ExpressError=require("./utils/ExpressError.js");
//const {listingSchema,reviewSchema}=require("./schema.js")
//const Review=require("./models/review.js");
//const{reviewSchema}=require("./schema.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");


const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const dbUrl=process.env.ATLASDB_URL;
async function main() {
   // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(dbUrl);
}

main()
.then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log(err);
});


const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
         secret:process.env.SECRET,
    },
    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store",err);
})

const sessionOptions={
    store,
    secret:"process.env.SECRET",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,// this is 1000 milisecond. it expires after 7 days
        maxAge:7*24*60*60*1000,
        httpOny:true, // for security purpose
    },
};



app.use(session(sessionOptions));
app.use(flash());
// passport implemented after session becoz ek session me user ke credentials same honge 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//Generates a function that is used by Passport to serialize users into the session means to store all the info related to user into the session
passport.deserializeUser(User.deserializeUser());//Generates a function that is used by Passport to deserialize users into the session means to unstore all the info related to user from the session jab uska session khatam ho jaeyga


app.use((req,res,next)=>{
    res.locals.success=req.flash("success"); // retrieve value under the key success
    //console.log(res.locals.success);
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"student@gmail.com",
//         username:"student",
//     });
//     let registeredUser= await User.register(fakeUser,"helloworld");//static method to register a new user instance with a given password. Checks if username is unique
//     res.send(registeredUser);
// });

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.use("/listings",listingRouter);// means /listing jaha bhi aaeyga we will use our listings
app.use("/listings/:id/reviews", reviewRouter);//these 2 routes should be after flash
app.use("/",userRouter);






//If none of the above route matches req will come here
// app.all("*",(req,res,next)=>{
//    const err=new ExpressError(404,"Page Not Found!");
//    next(err);
// });

// Error handling middlesware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("listings/err.ejs",{err});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
