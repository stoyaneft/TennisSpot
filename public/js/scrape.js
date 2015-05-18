"use strict"

var request = require('request');
var cheerio = require('cheerio');
var jf = require('jsonfile');

var URL = "http://www.atpworldtour.com/Rankings/Rankings-Home.aspx";
var FILE = "ranking.json";

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
        console.log(player);
    })
    jf.writeFileSync(FILE, top10);
  }
});

// request('https://news.ycombinator.com', function (error, response, html) {
//   if (!error && response.statusCode == 200) {
//     var $ = cheerio.load(html);
//     $('span.comhead').each(function(i, element){
//       var a = $(this).prev();
//       console.log(a.text());
//     });
//   }
// });
