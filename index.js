const express = require("express");
const serverless = require("serverless-http");
const path = require("path");

const app = express();

// Set view engine
app.set("views", path.join(process.cwd(), "views"));
app.set("view engine", "ejs");

// Middleware
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.render("admin/login.ejs");
});

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