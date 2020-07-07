const { DEFAULT_ENCODING } = require("crypto");

function aFunc(callback) {
  setTimeout(function () {
    console.log("a");
    callback();
  }, 700);
}

function bFunc(callback) {
  setTimeout(function () {
    console.log("b");
    callback();
  }, 1000);
}

function cFunc(callback) {
  setTimeout(function () {
    console.log("c");
    callback();
  }, 500);
}

aFunc(function () {
  bFunc(function () {
    cFunc(function () {});
  });
});
