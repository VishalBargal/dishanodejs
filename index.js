const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const upload = require("express-fileupload");
const cors = require("cors");
const serverless = require("serverless-http");

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public"))); // use process.cwd()
app.use(upload());
app.use(cors());

// Session (note: memory store will reset per request)
app.use(
  session({
    key: "userId",
    secret: "dishacomputers234",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
  })
);

// View engine
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

// Root route - login page
app.get("/", (req, res) => {
  res.render("admin/login.ejs");
});

// Export the serverless handler
module.exports.handler = serverless(app);








// var express=require("express");
// var app=express();
// var bodyParser=require('body-parser');
// var url=require('url');
// const cors = require('cors');
// const session = require('express-session');
// var upload=require("express-fileupload");
// app.use(bodyParser.urlencoded({extended:'true'}));
// app.use(express.static(__dirname+"/public"));
// app.use(upload());
// app.use(cors());



// app.use(
//     session({
//         key:'userId',
//         secret:'dishacomputers234',
//         resave:false,
//         saveUninitialized:false,
//         // cookie: {
//         //     expires:60 * 60 * 24, 
//         // },
//     })
//   );

// var adminpanel=require("./routes/admin/adminpanel");
// app.use("/admin",adminpanel);


// app.get("/",(req,res)=>{
//     res.send("done");
//     // res.render("views/admin/login.ejs");
    
// })

// app.listen(1000);