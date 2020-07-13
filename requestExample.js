const request = require("request");
var parseString = require("xml2js").parseString;

var url =
  "http://www.weather.go.kr/weather/forecast/mid-term-rss3.jsp?stnld=109";
request(url, function (error, response, body) {
  //console.log("body:", body); // Print the HTML for the Google homepage.
  parseString(body, function (err, result) {
    console.dir(result.rss.channel[0].item[0].description[0].header[0].wf[0]);
  });
});
