const express = require("express");
const app = express();
const path = require("path");
const request = require("request");
var mysql = require("mysql");
const jwt = require("jsonwebtoken");
const auth = require("./lib/auth");

var connection = mysql.createConnection({
  user: "root",
  password: "1q2w3e4r",
  database: "fintech",
  port: "3306",
});

connection.connect();

app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "public"))); //to use static asset

app.get("/signup", function (req, res) {
  res.render("signup");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/authTest", auth, function (req, res) {
  console.log(req.decoded);
  res.json("로그인이 완료된 사용자가 보는 화면");
});

app.get("/main", function (req, res) {
  res.render("main");
});

app.get("/balance", function (req, res) {
  res.render("balance");
});

//------------------view / login-----------------

app.get("/authResult", function (req, res) {
  var authCode = req.query.code;
  console.log("사용자 인증코드 : ", authCode);
  var option = {
    method: "POST",
    url: "https://testapi.openbanking.or.kr/oauth/2.0/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
    form: {
      code: authCode,
      //#자기 키로 시크릿 변경
      client_id: "q7kH44ThJwjpvNRg0BbJvE1yxvx5X53DKz1rNgPF",
      client_secret: "yVT6irMr2h4ZTHzZY7sDpbvhm1nlOzr4nP7DYRVy",
      redirect_uri: "http://localhost:3000/authResult",
      grant_type: "authorization_code",
    },
  };
  request(option, function (error, response, body) {
    if (error) {
      console.error(error);
      throw error;
    } else {
      var accessRequestResult = JSON.parse(body);
      console.log(accessRequestResult);
      res.render("resultChild", { data: accessRequestResult });
    }
  });
});

app.post("/signup", function (req, res) {
  console.log(req.body);
  var userName = req.body.userName;
  var userPassword = req.body.userPassword;
  var userEmail = req.body.userEmail;
  var userAccessToken = req.body.userAccessToken;
  var userRefreshToken = req.body.userRefreshToken;
  var userSeqNo = req.body.userSeqNo;

  var sql =
    "INSERT INTO user (`name`, `email`, `password`, `accesstoken`, `refreshtoken`, `userseqno`) VALUES (?, ?, ?, ?, ?, ?)";
  connection.query(
    sql,
    [
      userName,
      userEmail,
      userPassword,
      userAccessToken,
      userRefreshToken,
      userSeqNo,
    ],
    function (error, results) {
      if (error) throw error;
      else {
        res.json(1);
      }
    }
  );
});

app.post("/login", function (req, res) {
  console.log(req.body);
  var userEmail = req.body.userEmail;
  var userPassword = req.body.userPassword;
  var sql = "SELECT * FROM user WHERE email = ?";
  connection.query(sql, [userEmail], function (error, results) {
    if (error) throw error;
    else {
      if (results.length == 0) {
        res.json("등록되지 않은 회원입니다.");
      } else {
        var dbPassword = results[0].password;
        console.log("db 에서 가져온 패스워드", dbPassword);
        if (userPassword == dbPassword) {
          var tokenKey = "f@i#n%tne#ckfhlafkd0102test!@#%";
          jwt.sign(
            {
              userId: results[0].id,
              userEmail: results[0].email,
            },
            tokenKey,
            {
              expiresIn: "10d",
              issuer: "fintech.admin",
              subject: "user.login.info",
            },
            function (err, token) {
              console.log("로그인 성공", token);
              res.json(token);
            }
          );
        } else {
          res.json("비밀번호가 다릅니다");
        }
      }
    }
  });
});

app.post("/list", auth, function (req, res) {
  var userId = req.decoded.userId;
  //request 계좌 목록 조회 요청 만들기 request 모듈 활용
  //res.json(aPI 결과 body 객체)
  var sql = "SELECT * FROM user WHERE id = ?";
  connection.query(sql, [userId], function (error, results) {
    if (error) {
      console.error(error);
      throw error;
    } else {
      console.log(results[0]);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/user/me",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + results[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          user_seq_no: results[0].userseqno,
        },
      };
      request(option, function (error, response, body) {
        if (error) {
          console.error(error);
          throw error;
        } else {
          var resultJson = JSON.parse(body);
          console.log(resultJson);
          res.json(resultJson);
        }
      });
    }
  });
});

app.post("/balance", auth, function (req, res) {
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  console.log("받아온 데이터", userId, fin_use_num);
  var sql = "SELECT * FROM user WHERE id = ?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599190U" + countnum; //이용기과번호 본인것 입력

  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      console.log("밸런스 받아온 데이베이스 값 : ", result);
      var option = {
        method: "GET",
        url: "https://testapi.openbanking.or.kr/v2.0/account/balance/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          tran_dtime: "20200715114100",
        },
      };
      request(option, function (err, response, body) {
        console.log(body);
        var balanceResult = JSON.parse(body);
        res.json(balanceResult);
      });
    }
  });
});

app.post("/transactionList", auth, function (req, res) {
  var userId = req.decoded.userId;
  var fin_use_num = req.body.fin_use_num;
  console.log("받아온 데이터", userId, fin_use_num);

  var sql = "SELECT * FROM user WHERE id = ?";

  var countnum = Math.floor(Math.random() * 1000000000) + 1;
  var transId = "T991599190U" + countnum; //이용기과번호 본인것 입력

  connection.query(sql, [userId], function (err, result) {
    if (err) {
      console.error(err);
      throw err;
    } else {
      var option = {
        method: "GET",
        url:
          "https://testapi.openbanking.or.kr/v2.0/account/transaction_list/fin_num",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: "Bearer " + result[0].accesstoken,
        },
        //form 형태는 form / 쿼리스트링 형태는 qs / json 형태는 json ***
        qs: {
          bank_tran_id: transId,
          fintech_use_num: fin_use_num,
          inquiry_type: "A",
          inquiry_base: "D",
          from_date: "20190101",
          to_date: "20190101",
          sort_order: "D",
          tran_dtime: "20200715114100",
        },
      };
      request(option, function (err, response, body) {
        console.log(body);
        var transactionResult = JSON.parse(body);
        res.json(transactionResult);
      });
    }
  });
});

app.listen(3000);
