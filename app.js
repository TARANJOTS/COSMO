require('dotenv').config();
const express=require('express');
const https=require("https") //for accessing externel url(api)
const bodyParser=require("body-parser"); //for parsing the post request
const ejs=require("ejs");
const { title } = require('process');

const app=express();

app.use(bodyParser.urlencoded({extended:true}));

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.get("/",function(req,res){
    res.render("home")
})

app.get("/APOD",function(req,res){
    const apiKey=process.env.API_KEY;
    const url="https://api.nasa.gov/planetary/apod?api_key="+apiKey+"&hd="+true;

    https.get(url,function (response) {
        console.log(response.statusCode);

        response.on("data",function (data) {
            const APOD=JSON.parse(data);
            const title=APOD.title;
            const explanation=APOD.explanation;
            const image=APOD.hdurl;
            const copyright=APOD.copyright;
            console.log(APOD);
            console.log(copyright);
            res.render("APOD",{title:title,explanation:explanation,image:image,copyright:copyright});
        })
    })
})


app.listen(3000, function() {
    console.log("Server started on port 3000");
  });
  