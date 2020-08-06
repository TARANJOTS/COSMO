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
            const video=APOD.hdurl;
            if(APOD.media_type=="video"){
                const video=APOD.url;
            }
            const copyright=APOD.copyright;
            console.log(APOD);
            console.log(copyright);
            res.render("APOD",{title:title,explanation:explanation,image:image,copyright:copyright,video:video});
        })
    })
})
app.get("/about",function(req,res){
    res.render("about")
})

app.post("/results",function(req,res){
    const query=req.body.search;
    const url="https://images-api.nasa.gov/search?media_type=image&q="+query;
    console.log(url);
    https.get(url,function (response) {
        var data = ''; 
        response.on('data', (chunk) => { 
            data += chunk.toString(); 
        }); 
        response.on('end', () => { 
            const body = JSON.parse(data);
            const items=body.collection.items;
            console.log(items);
            res.render("results",{searchResults:items,query:query})
        }); 
        
    });
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
    console.log("Server started successfully");
  });
  