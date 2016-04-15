/**
 * Eloquent JS
 * Chapter 05 Exercises
 */

var ancestryFile = require('./ancestry.js');

var flattening = function () {
  'use strict';
  function flattenArray(arr) {
    if (!Array.isArray(arr)) {
      return arr;
    }
    return arr.reduce(function (prev, cur) {
      if (Array.isArray(cur)) {
        return prev.concat(flattenArray(cur));
      } 
      return prev.concat(cur);
    }, []);
  }
  var a1 = 'you can all run backwards'.split('');
  var a2 = ' naked '.split('');
  var a3 = 'through a field'.split('');
  var a4 = [a3, 'of dicks'.split('')];
  var a5 = a1.concat(a2,a4);
  console.log(a5);
  console.log(flattenArray(a5));
}();

var motherChildAgeDifference = function () {
  'use strict';

  var ancestry = JSON.parse(ancestryFile);

  function avgMotherChildAgeDifference(ancestry) {
    var byName = {};
    ancestry.forEach(function(person) {
      byName[person.name] = person;
    });
    var result = ancestry.reduce(function (total, person) {
      var mother = byName[person.mother]; 
      if (mother) {
        total.sum += person.born - mother.born;
        total.count++;
      }
      return total;
    }, { sum: 0, count: 0 } );
    return result.sum / result.count;
  }
  console.log(avgMotherChildAgeDifference(ancestry));
}();

var historicalLifeExpectancy = function () {
  'use strict';
  var ancestry = JSON.parse(ancestryFile);

  function average(array) {
    function plus(a, b) { return a + b; }
    return array.reduce(plus) / array.length;
  }

  function groupBy(arr, groupRule) {
    var result = Object.create(null);
    arr.forEach(function (e) {
      var groupKey = groupRule(e);
      if (!result[groupKey]) {
        result[groupKey] = [e];
      } else {
        result[groupKey].push(e);
      }
    });
    return result;
  }

  function centuryAges(ancestry) {

    function personCentury(p) {
      return Math.ceil(p.died / 100);
    }

    function personLifespan(p) {
      return p.died - p.born;
    }

    var ancByCentury = groupBy(ancestry, personCentury);

    var result = {};
    Object.keys(ancByCentury).forEach(function (cent) {
      result[cent] = ancByCentury[cent].map(personLifespan);
    });
    return result;
  }

  console.log(centuryAges(ancestry));

  function centuryLE(ancestry) {
    var ca = centuryAges(ancestry);
    function sum(a, b) {
      return a + b;
    }
    Object.keys(ca).forEach(function (c) {
      console.log('\t'+c+': '+ca[c].reduce(sum)/ca[c].length);
    });
  }

  centuryLE(ancestry);
  
}();

var everyAndThenSome = function () {

  function every(arr, f) {
    for (var i = 0; i < arr.length; i++) {
      if (!f(arr[i])) {
        return false;
      }
    }
    return true;
  }

  function some(arr, f) {
    for (var i = 0; i < arr.length; i++) {
      if (f(arr[i])) {
        return true;
      }
    }
    return false;
  }

  console.log(every([NaN, NaN, NaN], isNaN));
  // → true
  console.log(every([NaN, NaN, 4], isNaN));
  // → false
  console.log(some([NaN, 3, 4], isNaN));
  // → true
  console.log(some([2, 3, 4], isNaN));
  // → false

}();
