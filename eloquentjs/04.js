/**
 * Eloquent JS
 * Chapter 04 Exercises
 */

/**
 * The Sum of a Range
 */
var sumOfARange = function () {
  'use strict';
  function range(start, end, step) {
    var r = [];
    var s = step;
    if (!s || 'number' !== typeof s) {
      if (start > end) {
        s = -1;
      } else {
        s = 1;
      }
    }
    var sign = s/Math.abs(s);
    if ( (end-start)*sign < 0 ) {
      throw new Error('Range [' + start + ',' + end + ',' +
          'step=' + step + '] will never terminate');
    }
    for (var n = start; (end - n)*sign >= 0; n+=s) {
      // console.log('['+start+','+end+',step='+s+']: '+n);
      r.push(n);
    }
    return r;
  }

  function sum(arr) {
    var sum = 0;
    if (!Array.isArray(arr)) {
      throw newError('Array expected: ' + arr);
    }
    return arr.reduce(function (m, n, i) {
      if ('number' !== typeof n) {
        throw new Error('Number expected: ' + n);
      }
      return m + n;
    }, 0);
  }
  
  console.log(range(1, 10));
  // → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  console.log(range(5, 2, -1));
  // → [5, 4, 3, 2]
  console.log(sum(range(1, 10)));
  // → 55
  // console.log(sum(['a','3',{}])); // Error
  console.log(range(5, 5, -1));
  console.log(range(1, -10, -2));
  console.log(sum(range(1, -10, -2)));
  console.log(sum(range(1, -10, -0.29)));
  // console.log(range(3, 5, -10));
}();

/**
 * Reversing an Array
 */
var reversingAnArray = function () {
  'use strict';
  function reverseArray(arr) {
    var result = [];
    arr.forEach(function (e) {
      result.unshift(e);
    });
    return result;
  }

  function reverseArrayInPlace(arr) {
    for (var i = 0; i < Math.floor(arr.length/2); i++) {
      var swapper = arr[i];
      arr[i] = arr[arr.length - i - 1];
      arr[arr.length - i - 1] = swapper;
    }
  }
  console.log(reverseArray(["A", "B", "C"]));
  // → ["C", "B", "A"];
  var arrayValue = [1, 2, 3, 4, 5];
  reverseArrayInPlace(arrayValue);
  console.log(arrayValue);
  // → [5, 4, 3, 2, 1]
}();


/**
 * A List
 */
var aList = function () {
  'use strict';

  function arrayToList(arr) {
    if (!Array.isArray(arr)) {
      throw new Error('Array expected: ' + arr);
    }
    var list;
    arr.reduce(function (prev, e, i) {
      var node = { value: e, rest: null, };
      if (!prev) {
        list = node;
      } else {
        prev.rest = node;
      }
      return node;
    }, null);
    return list;
  }

  function listToArray(list) {
    if (!Object.prototype.isPrototypeOf(list)) {
      throw new Error('List object expected: ' + list);
    }
    var result = [];
    var node = list;
    while (node) {
      result.push(node.value);
      node = node.rest;
    }
    return result;
  }

  function prepend(e, list) {
    if (null !== list && !Object.prototype.isPrototypeOf(list)) {
      throw new Error('List objected expected: ' + list);
    }
    return { value: e, rest: list };
  }

  function nth(list, n) {
    if (!list) return undefined;
    if (0 === n) {
      return list;
    } else {
      return nth(list.rest, n-1);
    }
  }

  console.log(arrayToList([10, 20]));
  // → {value: 10, rest: {value: 20, rest: null}}
  console.log(listToArray(arrayToList([10, 20, 30])));
  // → [10, 20, 30]
  console.log(prepend(10, prepend(20, null)));
  // → {value: 10, rest: {value: 20, rest: null}}
  console.log(nth(arrayToList([10, 20, 30]), 1));
  // → 20
}();


/**
 * Deep Comparison
 */
var deepComparison = function () {
  function deepEqual(lhs, rhs) {
    // console.log('\n\n'+lhs+' '+rhs)
    if ('object' === typeof lhs && 'object' === typeof rhs && lhs && rhs) {

      function getAllPropertyNames(obj) {
        var result = [];
        while (obj) {
          result = result.concat(Object.getOwnPropertyNames(obj));
          obj = Object.getPrototypeOf(obj);
        }
        return result;
      }
      
      var lhprop = getAllPropertyNames(lhs);
      var rhprop = getAllPropertyNames(rhs);
      if (lhprop.length !== rhprop.length) {
        return false;
      }
      search_properties: for (var i =0; i < lhprop.length; i++) {
        var key = lhprop[i];
        // console.log('key: '+key+' lhs: '+lhs[key]+' rhs: '+rhs[key]);
        if (!(key in rhs) || lhs[key] !== rhs[key]) {
          if (rhs[key] && 'object' === typeof rhs[key]) {
            if (deepEqual(lhs[key],rhs[key])) {
              continue search_properties;
            }
          }
          return false;
        } // if
      }
      return true;
    }
    return lhs === rhs;
  }
  var obj = {here: {is: "an"}, object: 2};
  console.log(deepEqual(obj, obj));
  // → true
  console.log(deepEqual(obj, {here: 1, object: 2}));
  // → false
  console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
  // → true
}();
