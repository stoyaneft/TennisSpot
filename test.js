'use strict'

url = "http://www.atpworldtour.com/Rankings/Rankings-Home.aspx"

$.ajax({
  url: url,
  dataType: "jsonp",
  success: function (data) {
    console.log(data)
    alert(data);
  }
});
