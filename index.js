const express = require('express'),
    app = express(),
    config = require("./config"),
    bodyParser = require("body-parser");

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

var arr = [
    "uno",
    "bene",
    "twerte"
];

var data = "lol";
//get requests
app.get('/', function(req, res) {
    res.render("index.ejs", {data:data});
});
app.get('/edit', function(req, res){
    res.render("edit.ejs", {arr:arr});
});
//post requests
app.post('/edit', function(req, res){
    console.log(req.body);
    arr.push(req.body.text);
    res.redirect('/edit');
});

//run server
app.listen(config.PORT, () => console.log(`Example app listening on port ${config.PORT}!`));