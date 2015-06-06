"use strict"

// dependancies
var express = require('express');
var fs = require("fs");
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var posts = require("./posts.json");
var rankings = require("./ranking.json");
var request = require('request');
var cheerio = require('cheerio');
var jf = require('jsonfile');

// restify
var restify = require("iblokz-node-restify");
var restMap = require("./data/restMap.json");

var URL = "http://www.atpworldtour.com/Rankings/Rankings-Home.aspx";
var FILE = "ranking.json";


function scrapeRankings(){
    request(URL, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);
            var top10 = [];
            $('div.singles-tab').find('li').each(function(){
                var li = $(this);
                var nationality = li.attr('data-country');
                var rank = li.find('.rank').text();
                var points = li.find('.score').text();
                var fname = li.find('.fname').text();
                var lname = li.find('.lname').text();
                var name = fname + " " + lname;
                var player = {rank: rank, points: points, name: name, nationality: nationality};
                top10.push(player);
            })
            jf.writeFileSync(FILE, top10);
         }
    });
}

scrapeRankings();
// create app
var app = express()

// connect to db
var db = mongoose.connect("mongodb://localhost/tennisSpot");

// load model
restify.loadModel(restMap, db);

// configuration and middleware
app.use(express.static('public'));
app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(methodOverride());

//routes
app.get('/', function (req, res) {
  res.render('index', {posts: posts});
  //res.render('rankings', {rankings: rankings});
})

// admin route
app.get('/admin/', function (req, res) {
  res.render('admin/index');
})

//listen for files: /post -> /views/post.jade
app.get("/:fileName", function(req, res, next){
  if(req.params && req.params.fileName){
    var fileName = req.params.fileName.replace(".html","");

    if (fileName == 'rankings'){

        res.render('rankings', {rankings: rankings});
    }
    // if jade file exists
    if(fs.existsSync(__dirname+"/views/"+fileName+".jade")){
      res.render(fileName);
    // if post is in posts
    } else if (posts[fileName]) {
      res.render("post", {post: posts[fileName]});
    // else continue
    } else {
      next();
    }

  } else {
    next();
  }
})

// init routes
restify.initRoutes(app,restMap,{},db);

// set up server
var server = app.listen(3000, function () {

    var host = server.address().address
    var port = server.address().port
    console.log('Example app listening at http://%s:%s', host, port)

})

