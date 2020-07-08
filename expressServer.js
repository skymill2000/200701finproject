const express = require("express");
const app = express();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.get("/ejsTest", function (req, res) {
  res.render("test");
});

app.post("/ajaxTest", function (req, res) {
  var userId = req.body.sendUserId;
  var userPassword = req.body.sendUserPassword;
  console.log("요청 바디 :", req.body);
  console.log("사용자 아이디는 :", userId);
  console.log("사용자 password :", userPassword);

  res.json("로그인에 성공하셨습니다.");
});

app.get("/addRouter", function (req, res) {
  console.log("router working");
  res.send("<html><h1>안녕하세요 html 코드입니다. </h1></html>");
});

app.listen(3000);