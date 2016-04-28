/**
 * Solutions for Eloquent JS Chapter 06 Exercises
 * http://eloquentjavascript.net/06_object.html
 */

var aVectorType = function() {
  'use strict';

  function Vector(x, y) {
    if (x && y) {
      this.x = Number(x);
      this.y = Number(y);
    } else {
      this.x = undefined;
      this.y = undefined;
    }
    // plus( ) and minus( ) are generic: work for any object x, y
    this.plus = function plus(v) {
      var vectorHas = Object.prototype.hasOwnProperty.bind(v);
      if (vectorHas('x') && vectorHas('y')) {
        return new Vector(this.x+v.x, this.y+v.y);
      }
    };
    this.minus = function minus(v) {
      var vectorHas = Object.prototype.hasOwnProperty.bind(v);
      if (vectorHas('x') && vectorHas('y')) {
        return new Vector(this.x-v.x, this.y-v.y);
      }
    };

    function vectorNorm(vArr) {
      return Math.sqrt(vArr.reduce(function sumSquares(p, c) {
        return p + Math.pow(c,2);
      }, 0));
    }

    Object.defineProperty(this, 'length', {
      get: function length() { return vectorNorm([this.x, this.y]); }
    });
  }

  console.log(new Vector(1, 2).plus(new Vector(2, 3)));
  // → Vector{x: 3, y: 5}
  console.log(new Vector(1, 2).minus(new Vector(2, 3)));
  // → Vector{x: -1, y: -1}
  console.log(new Vector(3, 4).length);
  // → 5
}();

var anotherCell = function() {
  'use strict';

  /**
   * Table
   */

  function drawTable(rows) {
    var heights = rowHeights(rows);
    var widths = colWidths(rows);

    function drawLine(blocks, lineNo) {
      return blocks.map(function(block) {
        return block[lineNo];
      }).join(' ');
    }

    function drawRow(row, rowNum) {
      var blocks = row.map(function(cell, colNum) {
        return cell.draw(widths[colNum], heights[rowNum]);
      });
      return blocks[0].map(function(_, lineNo) {
        return drawLine(blocks, lineNo);
      }).join('\n');
    } // drawRow( )

    return rows.map(drawRow).join('\n');
  } // drawTable( )

  /**
   * Compute array of minimum row heights for a grid of cells.
   */
  function rowHeights(rows) {
    return rows.map(function(row) {
      return row.reduce(function(max, cell) {
        return Math.max(max, cell.minHeight());
      }, 0);
    });
  } // rowHeights( )

  /**
   * Compute array of minimum column widths for a grid of cells.
   */
  function colWidths(rows) {
    return rows[0].map(function(_, i) {
      return rows.reduce(function(max, row) {
        return Math.max(max, row[i].minWidth());
      }, 0);
    });
  } // colWidths( )

  /**
   * Return @string concatenated @times times
   */
  function repeat(string, times) {
    var result = '';
    for (var i = 0; i < times; i++) {
      result += string;
    }
    return result;
  }

  /**
   * TextCell
   */

  function TextCell(text) {
    this.text = text.split("\n");
  }

  TextCell.prototype.minWidth = function() {
    return this.text.reduce(function(width, line) {
      return Math.max(width, line.length);
    }, 0);
  };

  TextCell.prototype.minHeight = function() {
    return this.text.length;
  };

  TextCell.prototype.draw = function(width, height) {
    var result = [];
    for (var i = 0; i < height; i++) {
      var line = this.text[i] || "";
      result.push(line + repeat(" ", width - line.length));
    }
    return result;
  };

  /**
   * Cell Interface
   *
   * minHeight() - returns a number indicating the minimum height this cell
   * requires (in lines)
   *
   * minWidth() - returns a number indicating this cell's minimum width (in
   * characters)
   *
   * draw(width, height) returns an array of length height, which contains a
   * series of strings that are each width characters wide. This represents the
   * content of the cell.
   */

  function StretchCell(inner, width, height) {
    this._width = (width > inner.minWidth()) ? width : inner.minWidth();
    this._height = (height > inner.minHeight()) ? height : inner.minHeight();
    this.inner = inner;
  }

  StretchCell.prototype.minHeight = function minHeight() {
    return this._height;
  }

  StretchCell.prototype.minWidth = function minWidth() {
    return this._width;
  }

  StretchCell.prototype.draw = function draw(width, height) {
    var innerRows = this.inner.draw(width, height).map(function innerRows(r) {
      if (r.length < width) {
        return r + repeat(' ', width - r.length);
      }
      return r.substr(0, width);
    });

    if (height === innerRows.length) {
      return innerRows;
    }
    if (innerRows.length > height) {
      return innerRows.slice(0, height - 1);
    } 

    var result = innerRows;
    for (var i = innerRows.length; i < height; i++) {
      result.push(repeat(' ', width));
    } // for
    return result;
  }

  var sc = new StretchCell(new TextCell("abc"), 1, 2);
  console.log(sc.minWidth());
  // → 3
  console.log(sc.minHeight());
  // → 2
  console.log(sc.draw(3, 2));
  // → ["abc", "   "]

}();


var sequenceInterface = function() {
  'use strict';

  /**
   * Represents a sequence of elements from an array.
   * @constructor
   * @param {Array} elem - An array
   */
  function ArraySeq(elem) {
    this._elements = elem;
    this._i = null;
    return this;
  }

  /**
   * Returns the first element in the list, or undefined if no elements
   * are defined.
   */
  ArraySeq.prototype.start = function start() {
    if (this._elements) { return this._elements[0]; }
  }

  /**
   * Sets the current element to the first element in the sequence.
   */
  ArraySeq.prototype.reset = function reset() {
    this._i = 0;
  }

  Object.defineProperty(ArraySeq.prototype, 'length', {
    get: function() { return this._elements.length; }
  });

  ArraySeq.prototype.current = function current() {
    if (this._elements.length) {
      if (!this._i) {
        this._i = 0;
      }
      return this._elements[this._i];
    }
  };

  Object.defineProperty(ArraySeq.prototype, 'index', {
    get: function index() { return this._i; }
  });

  /**
   * Returns the element before the current element in the list, or undefined
   * if the current element is the start of the sequence.
   */
  ArraySeq.prototype.previous = function previous() {
    if (this._i > 0) {
      return this._elements[this._i - 1];
    }
  };

  /**
   * Sets the current element to the next element, and returns that value, or
   * false if the sequence has previously reached the last element.
   */
  ArraySeq.prototype.next = function next() {
    if (this._i < this.length - 1) {
      this._i++;
      return this.current();
    }
    return false;
  };

  /**
   * Returns true if the sequence has previously reached the last element since
   * the last reset.
   */
  ArraySeq.prototype.reachedEnd = function end() {
    if (!this.length || this._i === this.length - 1) {
      return true;
    }
    return false;
  };


  /**
   * Represents an increasing sequence of consecutive integers.
   * @constructor
   * @param {number} from - first integer in the sequence
   * @param {numher} to - final integer in the sequence
   */
  function RangeSeq(from, to) {
    this._cur = from;
    this._last = (from < to) ? to : from;
    return this;
  }

  /**
   * Return the current element in the sequence.
   * @returns {Number}
   */
  RangeSeq.prototype.current = function current() {
    return this._cur;
  };

  /**
   * Return true if sequece has reached the last element, false otherwise.
   * @returns {Boolean}
   */
  RangeSeq.prototype.reachedEnd = function end() {
    return !(this._cur < this._last);
  };

  /**
   * Sets the current element to the next integer in the sequence, and return it.
   */
  RangeSeq.prototype.next = function next() {
    if (!this.reachedEnd()) {
      this._cur++;
      return this._cur;
    }
    return false;
  };

  function logFive(seq) {
    var i = 0;
    do {
      console.log(seq.current());
      i++;
    } while (i < 5 && seq.next());
  }

  logFive(new ArraySeq([1, 2]));
  // → 1
  // → 2
  logFive(new RangeSeq(100, 1000));
  // → 100
  // → 101
  // → 102
  // → 103
  // → 104
}();

