const express=require("express");
const app=express();
const users=require("./routes/user.js")
const posts=require("./routes/posts.js");
//const cookieParser=require("cookie-parser");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//app.use(cookieParser("secretcode")); // whenever we get a req it goes through cookie-parser and then jo route call hua h wo call ho jaeyga 

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("madeIn","India");
    res.send("Send you some cookies!");
});

// Signed cookie
app.get("/getsignedcookie",(req,res)=>{
    res.cookie("made-in","India",{signed:true});
    res.send("signed cookie send");
});

app.get("/verify",(req,res)=>{
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/greet",(req,res)=>{
   let {name="anonymous"}=req.cookies; // if name doesnt exist name it anonymous
   res.send(`Hi, ${name}`);
});

app.get("/",(req,res)=>{
    console.dir(req.cookies);//it is not possible to directly parse cookie from req so we need a middleware named cookie parser
    res.send("Hi I am root");
});

app.use("/users", users);
app.use("/posts",posts);

// Express session
// app.use(session({  // used session as a middleware
//     secret:"mysupersecretstring",
//     resave:false,
//     saveUninitialized:true,
// })
// ); 

const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());
// flash middleware
app.use((req,res,next)=>{
  res.locals.successMsg=req.flash("success");
  res.locals.errorMsg=req.flash("error");
  next();
});
//--------------------------------------
// Express session-storing and using information
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query; // if no name given in query so anonymous will be appeared
    //console.log(req.session);
    req.session.name=name;
   // console.log(req.session.name);
    //res.send(name);
    if(name==="anonymous"){
      req.flash("error","User not registered");
    }else{
    req.flash("success","user registered successfully"); // this is a key- success and value-user registered successfully pair and can be anything related to message
    }
    res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
   // res.send(`hello, ${req.session.name}`);
  // console.log(req.flash("success"))
  //res.render("page.ejs",{name:req.session.name, msg:req.flash("success")});
  //res.locals.successMsg=req.flash("success");//better way to use flash
  //res.locals.errorMsg=req.flash("error");
  res.render("page.ejs",{name:req.session.name});
});
//-----------------------------------

// count how many times user req for the same link
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;//In stateless protocol when we have same req res is same but in statefull protocol generally for a same req res gets change like here we are getting different response
    } else{
        req.session.count=1;
    }
    res.send(`You sent a req ${req.session.count} times`);
});

app.get("/test",(req,res)=>{
    res.send("test successful");
});

app.listen(3000,()=>{
    console.log("server is listening to 3000")
});