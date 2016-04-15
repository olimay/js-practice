/**
 * Eloquent JS
 * Chapter 03 Exercises
 */

/**
 * Minimum
 */
var minimum = function() {
  'use strict';
  function min(x, y) {
    return (x <= y) ? x : y;
  }
  console.log(min(0, 10));
  console.log(min(0, -10));
}();

/**
 * Recursion
 */
var recursion = function() {
  'use strict';
  function isEven(x) {
    if ('number' !== typeof x) {
      throw new Error('number expected');
    }
    if (0 === x) {
      return true;
    } else if (1 === x) {
      return false;
    } else if (0 > x) {
      return isEven(-x);
    }
    return isEven(x-2);
  }
  console.log(isEven(50));
  // → true
  console.log(isEven(75));
  // → false
  console.log(isEven(-1));
}();

/**
 * Bean Counting
 */
var beanCounting = function () {
  'use strict';
  function countChar(str, c) {
    if (1 < c.length) {
      throw new Error('Single character expected: ' + c);
    }
    for (var i = 0, count = 0; i < str.length; i++) {
      if (str.charAt(i) === c) {
        count++;
      }
    }
    return count;
  }

  function countBs(str) {
    return countChar(str, 'B');
  }

  console.log(countBs("BBC"));
  // → 2
  console.log(countChar("kakkerlak", "k"));
  // → 4
}();
