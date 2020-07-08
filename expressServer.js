const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/ejsTest", function (req, res) {
  res.render("test");
});

app.get("/addRouter", function (req, res) {
  console.log("router working");
  res.send("<html><h1>안녕하세요 html 코드입니다. </h1></html>");
});

app.listen(3000);
