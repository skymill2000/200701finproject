function multi(p1, p2) {
  return p1 * p2; // p1, p2 곱연산의 결과를 반환한다.
}

function div(p1, p2) {
  return p1 / p2; // p1, p2 곱연산의 결과를 반환한다.
}

function plus(p1, p2) {
  return p1 + p2; // p1, p2 곱연산의 결과를 반환한다.
}

function minus(p1, p2) {
  return p1 - p2; // p1, p2 곱연산의 결과를 반환한다.
}

// const multi = (p1, p2) => {
//   return p1 * p2;
// };

//#work1 func 3개 추가 : 더하기 / 빼기 / 나누기 log 작성

console.log(multi(1, 2));
console.log(div(1, 2));
console.log(plus(1, 2));
console.log(minus(1, 2));

console.log(function () {
  return 4 + 2;
});
