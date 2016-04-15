/**
 * Eloquent JS
 * Chapter 2 Exercises
 */

/**
 * Looping a triangle.
 */
var loopingATriangle = function() {
  var output = '';
  for (var i = 1, output = ''; i <= 7; i++) {
    output += '#';
    console.log(output);
  }
}();

/**
 * FizzBuzz
 */
var fizzbuzz = function() {
  for (var i = 1; i <= 100; i++) {
    var output = '';
    if (i % 3 === 0) {
      output += 'Fizz';
    }
    if (i % 5 === 0) {
      output += 'Buzz';
    }
    if (!output.length) {
      output = i;
    }
    console.log(output);
  }
}();

/**
 * Chess Board
 */
var chessBoard = function() {
  var sq = ' #';
  for (var i = 0; i < 8; i++) {
    for (var j = 0, row = ''; j < 4; j++) {
      row += sq;
    }
    console.log(row);
    sq = sq.split('').reverse().join('');
  }
}();
