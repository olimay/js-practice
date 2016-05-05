/**
 * Eloquent JS
 * Chapter 07 - Electronic Life Project
 */
var electronicLife = function () {
  'use strict';

  /**
   * Represents a coordinate pair for a location in a world.
   * @constructor
   */
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  /**
   * Returns the result of adding a vector to current vector as a new Vector.
   * @memberof Vector#
   * @param {Vector} other - Vector to add to this one.
   * @return {Vector}
   */
  Vector.prototype.plus = function plus(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  };

  /**
   * Represents a grid for a world.
   * @constructor
   */
  function Grid(width, height) {
    this.space = new Array(width * height);
    this.width = width;
    this.height = height;
  }

  /**
   * Calls a function for each element in the grid.
   * @param {function} f - function to call on each element
   * @param {Object} context - this value to use in f
   */
  Grid.prototype.forEach = function(f, context) {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var value = this.space[x + y * this.width];
        if (value != null) {
          f.call(context, value, new Vector(x, y));
        }
      }
    }
  };

  /**
   * Returns true if the vector is inside the grid, false otherwise.
   * @memberof Grid#
   * @returns {Boolean}
   */
  Grid.prototype.isInside = function isinside(vector) {
    return vector.x >= 0 && vector.x < this.width &&
      vector.y >= 0 && vector.y < this.height;
  };

  /**
   * Returns grid element at specified by vector.
   * @memberof Grid#
   * @param {Vector} vector - coordinate in grid
   * @returns {Object}
   */
  Grid.prototype.get = function get(vector) {
    return this.space[vector.x + this.width * vector.y];
  };

  /**
   * Sets the value of a grid element at a particular coordinate.
   * @memberof Grid#
   * @param {Vector} - Grid coordinate
   * @param {Object} - new value
   */
  Grid.prototype.set = function set(vector, value) {
    this.space[vector.x + this.width * vector.y] = value;
  };

  /******************************
   * World
   */

  /**
   * Cardinal directions/vectors mapping.
   */
  var directions = {
    'n':  new Vector( 0, -1),
    'ne': new Vector( 1, -1),
    'e':  new Vector( 1,  0),
    'se': new Vector( 1,  1),
    's':  new Vector( 0,  1),
    'sw': new Vector(-1,  1),
    'w':  new Vector(-1,  0),
    'nw': new Vector(-1, -1)
  };

  /**
   * Element object represented by a character.
   * @returns {Object}
   */
  function elementFromChar(legend, ch) {
    if (ch == ' ') {
      return null;
    } // if ch == ' '
    var element = new legend[ch]();
    element.originChar = ch;
    return element;
  }

  /**
   * Representation of a World.
   * @constructor
   * @memberof World#
   */
  function World(map, legend) {
    var grid = new Grid(map[0].length, map.length);
    this.grid = grid;
    this.legend = legend;
    this.elementCount = Object.create(null);

    map.forEach(function (line, y) {
      for (var x = 0; x < line.length; x++) {
        // keep a count of elements
        this.incCount(line[x]);
        grid.set(new Vector(x, y), elementFromChar(legend, line[x]));
      }
    }, this);
  }

  /**
   * Character representation of an element.
   * @returns {string}
   */
  function charFromElement(element) {
    if (null === element) {
      return ' ';
    } else {
      return element.originChar;
    }
  }

  /**
   * String representation of the world.
   * @returns {string}
   * @memberof World#
   */
  World.prototype.toString = function tostring() {
    var output = '';
    for (var y = 0; y < this.grid.height; y++) {
      for (var x = 0; x < this.grid.width; x++) {
        var element = this.grid.get(new Vector(x, y));
        output += charFromElement(element);
      }
      output += '\n';
    }
    return output;
  }


  /**
   * Returns true of there is a count for an element type.
   * @memberof World#
   */
  World.prototype.hasCount = function hasCount(legend) {
    return Object.prototype.hasOwnProperty.call(this.elementCount, legend);
  };
  /**
   * Removes all element counts for a world.
   * @memberof World#
   */
  World.prototype.resetAllCounts = function resetAllCounts() {
    this.elementCount = Object.create(null);
  };
  /**
   * Sets the count for an element to zero.
   * @memberof World#
   */
  World.prototype.resetCount = function resetCount(legend) {
    // don't set count to zero if it's not already defined
    if (this.hasCount(legend)) {
      this.elementCount[legend] = 0;
    }
  };
  /**
   * Returns a count for an element represented by a particular legend.
   * Returns zero if there is no count for that element.
   * @memberof World#
   * @returns {number}
   */
  World.prototype.getCount = function getCount(legend) {
    if (!this.hasCount(legend)) {
      return 0; // return 0 even for undefined things
    }
    // error checking
    if ('number' !== typeof this.elementCount[legend]) {
      throw new Error('Expected number for count ' + legend + ': ' +
          this.elementCount[legend]);
    } else if (isNaN(this.elementCount[legend])) {
      throw new Error('Count for ' + legend + ' is NaN');
    }
    return this.elementCount[legend];
  };
  /**
   * Returns an object containing current counts for all objects.
   * Does not return the actual counts object.
   * @returns {object}
   * @memberof World#
   */
  World.prototype.allCounts = function allCounts() {
    var countsCopy = Object.create(null);
    // this should work since the count object has a null prototype
    for (var legend in this.elementCount) {
      countsCopy[legend] = this.getCount(legend);
    }
    return countsCopy;
  };
  /**
   * Adds an amount to a count, creating a count if necessary. If resulting
   * count is <= 0, removes that count.
   * @param {string} legend - character representing an element
   * @param {number} x - increment amount
   * @memberof World#
   */
  World.prototype.changeCount = function modCount(legend, x) {
    var before = this.elementCount[legend];
    if ('number' !== typeof x || isNaN(x)) {
      throw new Error('Invalid increment amount for ' + legend + 
          '; before=' + before + ' x=' + x
          );
      
    }
    if (!this.hasCount(legend)) {
      this.elementCount[legend] = x;
    } else {
      this.elementCount[legend] += x;
    }
    if (this.elementCount[legend] <= 0) {
      /* remove from counts when it reaches zero (prevents world from having a
       * 'history' */
      delete this.elementCount[legend];
    }
    // error checking
    if ('number' !== typeof this.elementCount[legend]) {
      throw new Error('Expected number for count ' + legend + ': ' +
          this.elementCount[legend] +
          '; before=' + before + ' x=' + x
          );
    } else if (isNaN(this.elementCount[legend])) {
      throw new Error('Count for ' + legend + ' is NaN' +
          '; before=' + before + ' x=' + x
          );
    }

  };
  /**
   * Adds an amount (default 1) to count for a legend
   * @param {string} legend - character representing an element
   * @param {number} x - increment amount
   * @memberof World#
   */
  World.prototype.incCount = function incCount(legend, x) {
    if (undefined === x) {
      this.changeCount(legend, 1);
    } else {
      this.changeCount(legend, x);
    }
  };
  /**
   * Subtracts an amount (default 1) to count for a legend
   * @param {string} legend - character representing an element
   * @param {number} x - increment amount
   * @memberof World#
   */
  World.prototype.decCount = function decCount(legend, x) {
    if (undefined === x) {
      this.changeCount(legend, -1);
    } else {
      this.changeCount(legend, -x);
    }
  };
      


  /**
   * Allows each critter in the grid to take a turn and updates critter counts.
   * @memberof World#
   */
  World.prototype.turn = function turn() {
    var acted = [];
    this.resetAllCounts();
    this.grid.forEach(function (critter, vector) {
      // update count for each element type
      var critterChar = charFromElement(critter);
      if (' ' === critterChar) { throw 'spaces are getting through foreach'; }
      this.incCount(critterChar);
      // act
      if (!vector) {
        throw new Error('Bad origin vector: ' + vector);
      }
      if (critter.act && acted.indexOf(critter) === -1) {
        acted.push(critter);
        this.letAct(critter, vector);
      }
    }, this);
    // 
    if (!this.getCount(' ')) {
      throw 'spaces aren\'t being counted...';
    }
  };

  /**
   * Allows a specified critter to take a turn.
   * @memberof World#
   */
  World.prototype.letAct = function letAct(critter, vector) {
    var action = critter.act(new View(this, vector));
    if (action && action.type == 'move') {
      var dest = this.checkDestination(action, vector);
      if (dest && this.grid.get(dest) === null) {
        this.grid.set(vector, null);
        this.grid.set(dest, critter);
      }
    }
  };

  /**
   * Returns a vector destination for an action if inside the world grid,
   * undefined if not.
   * @memberof World#
   * @param {Object} action - action object
   * @param {Vector} vector - starting position for action
   * @returns {Vector}
   */
  World.prototype.checkDestination = function checkDestination(action, vector) {
    if (directions.hasOwnProperty(action.direction)) {
      var dest = vector.plus(directions[action.direction]);
      if (this.grid.isInside(dest)) {
        return dest;
      }
    }
  };


  /******************************
   * View
   */

  var directionNames = 'n ne e se s sw w nw'.split(' ');

  /**
   * Represents a view, the regions immediately adjacent to a vector.
   * @constructor
   */
  function View(world, vector) {
    this.world = world;
    this.vector = vector;
  }

  /**
   * Returns the element in a particular direction.
   * @memberof View#
   * @returns {Object}
   */
  View.prototype.look = function look(dir) {
    try {
      var target = this.vector.plus(directions[dir]);
    } catch (e) {
      console.log(e);
      console.log(this.vector);
      console.log(dir);
    }
    if (this.world.grid.isInside(target)) {
      return charFromElement(this.world.grid.get(target));
    } else {
      return '#'; // wall
    }
  };

  /**
   * Returns array of all directions occupied by a specified element.
   * @memberof View#
   * @returns {Array}
   */
  View.prototype.findAll = function findAll(ch) {
    var found = [];
    for (var dir in directions) {
      if (this.look(dir) === ch) {
        found.push(dir);
      }
      return found;
    }
  };

  /**
   * Randomly selects a direction from directions containing a specified element.
   * @memberof View#
   * @param {string} ch - character representation of element to find
   * @returns {string}
   */
  View.prototype.find = function find(ch) {
    var found = this.findAll(ch);
    if (found.length === 0) {
      return null;
    }
    return randomElement(found);
  };

  function randomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  /******************************
   * Wall
   */

  function Wall(){}


  /******************************
   * Critter
   */


  /**
   * Represents a critter that moves in randomly chosen directions.
   * @constructor
   */
  function BouncingCritter() {
    this.direction = randomElement(directionNames);
  };

  /**
   * Simulates one turn for a Bouncing Critter.
   * @param {View} view - critter's view
   * @memberof BouncingCritter#
   */
  BouncingCritter.prototype.act = function act(view) {
    if (view.look(this.direction) !== ' ') {
      this.direction = view.find(' ') || 's';
    }
    return {type: 'move', direction: this.direction };
  };


  /**
   * Represents a critter that moves counterclockwise along walls it encounters
   * @constructor
   */
  function WallFollower() {
    this.dir = 's';
  }

  WallFollower.prototype.act = function act(view) {
    var start = this.dir;
    if (view.look(dirPlus(this.dir, -3)) != ' ') {
      start = this.dir = dirPlus(this.dir, -2);
    }
    while (view.look(this.dir) !== ' ') {
      this.dir = dirPlus(this.dir, 1);
      if (this.dir === start) { break; }
    }
    return { type: 'move', direction: this.dir }; 
  };

  /**
   * @returns {string}
   */
  function dirPlus(dir, n) {
    var index = directionNames.indexOf(dir);
    return directionNames[(index + n + 8) % 8];
  }

  /*******************************
   * Lifelike World
   */

  /**
   * Represents a world with energy, food, and death.
   * @constructor
   */
  function LifelikeWorld(map, legend) {
    World.call(this, map, legend);
  }
  LifelikeWorld.prototype = Object.create(World.prototype);

  var actionTypes = Object.create(null);

  actionTypes.grow = function grow(critter) {
    critter.energy += 0.5;
    return true;
  };

  /**
   * Allows a critter to move if it can. Costs 1 energy.
   * @param {object} critter - critter object
   * @param {Vector} vector - starting position
   * @param {object} action - move action
   * @returns {boolean}
   */
  actionTypes.move = function move(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    if (!vector) {
      throw new Error('Bad origin vector: ' + vector + ' dest=' + dest);
    }
    if (!dest) {
      throw new Error('Bad destination vector: ' + dest + ' origin=' + vector);
    }
    if (dest === null || critter.energy <= 1 || this.grid.get(dest) !== null) {
      return false;
    }
    critter.energy -= 1;
    this.grid.set(vector, null);
    this.grid.set(dest, critter);
    return true;
  };

  /**
   * Allows a critter to eat.
   * @param {object} critter - critter object
   * @param {Vector} vector - critter location
   * @param {object} action - eat action
   * @returns {boolean}
   */
  actionTypes.eat = function eat(critter, vector, action) {
    var dest = this.checkDestination(action, vector);
    var atDest = dest !== null && this.grid.get(dest);
    if (!atDest || atDest.energy == null) {
      return false;
    }
    critter.energy += atDest.energy;
    this.decCount(charFromElement(this.grid.get(dest)));
    this.grid.set(dest, null);
    return true;
  };

  /**
   * Allows a critter to reproduce. Returns true if able, false if unable.
   * Costs twice the energy of a baby critter.
   * @returns {boolean}
   */
  actionTypes.reproduce = function reproduce(critter, vector, action) {
    var baby = elementFromChar(this.legend, critter.originChar);
    var dest = this.checkDestination(action, vector);
    if (null === dest ||
        critter.energy <= 2 * baby.energy ||
        null !== this.grid.get(dest)) {
          return false;
        }
    critter.energy -= 2 * baby.energy;
    this.grid.set(dest, baby);
    return true;
  };

  /**
   * Simulates a turn for a critter at a specific location in the world grid.
   * @memberof LifelikeWorld#
   * @param {object} critter - critter to act
   * @param {Vector} vector - location of critter in the world
   */
  LifelikeWorld.prototype.letAct = function(critter, vector) {
    var action = critter.act(new View(this, vector));
    try {
    var handled = action &&
      action.type in actionTypes &&
      actionTypes[action.type].call(this, critter, vector, action);
    } catch (e) {
      console.log(e);
      if (critter) {
      console.log(critter);
      }
      if (vector) {
        console.log(vector.x + ' ' + vector.y);
      } else {
        console.log('vector: ' + vector);
      }
      if (action) {
        console.log(action);
      }
      throw 'crash';
    }
    if (!handled) {
      critter.energy -= 0.2;
      if (critter.energy <= 0) {
        this.grid.set(vector, null);
      }
    }
  };

  /*******************************
   * Lifelike Critters
   */

  /**
   * Represents a plant, which cannot move but can grow and reproduce.
   * Starts with energy between 3 and 7.
   */
  function Plant() {
    this.energy = 3 + Math.random() * 4;
  }

  /**
   * Allows a plant to take an action:
   * reproduce (if energy > 15)
   * grow (to max 20 energy).
   * @memberof Plant#
   * @returns {object}
   */
  Plant.prototype.act = function act(view) {
    if (this.energy > 15) {
      var space = view.find(' ');
      if (space) {
        return { type: 'reproduce', direction: space };
      }
      if (this.energy < 20) {
        return { type: 'grow' };
      }
    }
  };

  /**
   * Represents a critter that eats plants for energy.
   * @param {number} startEnergy - Starting energy for PlantEater critter.
   * @constructor
   */
  function PlantEater(startEnergy) {
    this.energy = (startEnergy) ? startEnergy : 20;
  }
  /**
   * Returns an action for a PlantEater.
   * @memberof PlantEater#
   * @returns {object}
   */
  PlantEater.prototype.act = function act(view) {
    var space = view.find(' ');
    if (this.energy > 60 && space) {
      return { type: 'reproduce', direction: space };
    }
    var plant = view.find('*');
    if (plant) {
      return { type: 'eat', direction: plant };
    }
    if (space) {
      return { type: 'move', direction: space };
    }
  };

  /**
   * Represents a plant eating critter with better survivability.
   * Starts with 20 energy and facing in a specified direction. If no direction
   * specified, starts facing in a random direction.
   * @constructor
   */
  function SmartPlantEater(startDir) {
    PlantEater.call(this, 20);
    this.direction = (undefined !== startDir) ?
      startDir :
      randomElement(directionNames);
    if (!this.direction) { throw new Error('Bad direction: ' + this.direction); }
    this.lastAte = 0;
  };
  /**
   * Returns an action for a SmartPlantEater to take.
   * @memberof SmartPlantEater#
   * @returns {object}
   */
  SmartPlantEater.prototype.act = function act(view) {
    var space = view.find(' ');
    var plant = view.find('*');
    // reproducing
    if (this.energy > 120 && space) {
      return { type: 'reproduce', direction: space };
    }
    // eating
    if (plant &&
        ((this.energy > 60 && this.lastAte > 10) ||
         (this.energy > 30 && this.lastAte > 3) ||
         this.energy < 30)) {
           this.lastAte = 0;
           return { type: 'eat', direction: plant };
    }
    // movement: if way is blocked, choose a new direction
    if (view.look(this.direction) !== ' ') {
      // look immediately to left and right, and behind
      var choices = [];
      var right = dirPlus(this.direction, 1);
      var left = dirPlus(this.direction, -1);
      var behind = dirPlus(this.direction, 4);
      var choice = 'not selected';

      // if space to left or right are open, randomly add to choices
      if (' ' == view.look(right)) { choices.push(right); }
      if (' ' == view.look(left)) { choices.push(left); }
      // decide what direction to turn
      if (choices.length) { // turn immediately l or r if possible
        this.direction = randomElement(choices);
        if (this.direction === left) choice = 'left';
        if (this.direction === right) choice = 'right';
      } else if (' ' === view.look(behind)) { // otherwise turn around if open
        this.direction = behind;
        choice = 'behind';
      } else if (space) { // otherwise just go to any open space
        this.direction = space; 
        choice = 'space';
      }
      if (!this.direction) {
        var message = 'Bad direction: ' + this.direction +
          ' choice was ' + choice;
        throw new Error(message);
      }

    }

    if (!this.direction) {
      var message = 'Bad direction: ' + this.direction;
      throw new Error(message);
    }

    return { type: 'move', direction: this.direction };
  };

  /**
   * Represents a Tiger critter, which is a predator.
   */
  function Tiger() {
    // stub
  }

  /*******************************
   * Tests
   */

  /**
   * Prints world at each turn, for n turns. (Default 5)
   * @param {World} world
   * @param {number} n - number of turns to simulate and print
   */

  // for (var testrunner = 0; testrunner < 400; testrunner++) {

  var simulateWorld = function animateWorld(world, n) {
    var turns = (n && n > 0) ? n : 5;
    for (var i = 0; i < turns; i++) {
      world.turn();
      console.log('Turn ' + i);
      console.log(world.toString() + '\n');
    }
  };

  var evaluateWorld = function animateWorld(world, n) {
    var turns = (n && n > 0) ? n : 5;
    for (var i = 0; i < turns; i++) {
      world.turn();
    }
    console.log('Turn ' + i);
    console.log(world.toString() + '\n');
  };

  var runWorld = function runWorld(world, n) {
    var maxTurns = (undefined === n) ? Infinity : n;
    var turns = 0;

    var critterCount = function critterCount(world) {
      var counts = world.allCounts();
      return Object.keys(counts).reduce(function (sum, cur) {
        if ('#' === cur) {
          return sum;
        }
        return sum + counts[cur];
      }, 0);
    };

    console.log('Start world >>');
    console.log(world.toString());
    do { 
      world.turn();
      console.log(world.allCounts());
      turns++;
    } while (turns < maxTurns && critterCount(world) > 0);
    console.log('End world : ' + turns + ' turns');
    console.log(world.toString());
  };

  var grid = new Grid(5, 5);
  console.log(grid.get(new Vector(1, 1)));
  // → undefined
  grid.set(new Vector(1, 1), 'X');
  console.log(grid.get(new Vector(1, 1)));
  // → X
  var test = {
    prop: 10,
    addPropTo: function(array) {
      return array.map(function(elt) {
        return this.prop + elt;
      }, this); // ← no bind
    }
  };
  console.log(test.addPropTo([5]));
  // → [15]
  var plan = ['############################',
      '#      #    #      o      ##',
      '#                          #',
      '#          #####           #',
      '##         #   #    ##     #',
      '###           ##     #     #',
      '#           ###      #     #',
      '#   ####                   #',
      '#   ##       o             #',
      '# o  #         o       ### #',
      '#    #                     #',
      '############################'];
  var world1 = new World(plan, {'#': Wall,
    'o': BouncingCritter});
  console.log(world1.toString());
  console.log('\n=== simulating worlds ===\n');
  console.log('bouncing critters only');
  simulateWorld(world1, 5);
  console.log('bouncing critters and wall followers');
  simulateWorld(new World(
        ['############',
        '#     #    #',
        '#   ~    ~ #',
        '#  ##      #',
        '#  ##  o####',
        '#          #',
        '############'],
        {'#': Wall,
          '~': WallFollower,
    'o': BouncingCritter}
    ), 20);

  var valley = new LifelikeWorld(
      ['############################',
      '#####                 ######',
      '##   ***                **##',
      '#   *##**         **  O  *##',
      '#    ***     O    ##**    *#',
      '#       O         ##***    #',
      '#                 ##**     #',
      '#   O       #*             #',
      '#*          #**       O    #',
      '#***        ##**    O    **#',
      '##****     ###***       *###',
      '############################'],
      {'#': Wall,
        'O': PlantEater,
      '*': Plant}
      );

  runWorld(valley, 500);

  var valleyTwo = new LifelikeWorld(
      ['############################',
      '#####                 ######',
      '##   ***                **##',
      '#   *##**         **  O  *##',
      '#    ***     O    ##**    *#',
      '#       O         ##***    #',
      '#                 ##**     #',
      '#   O       #*             #',
      '#*          #**       O    #',
      '#***        ##**    O    **#',
      '##****     ###***       *###',
      '############################'],
      {'#': Wall,
        'O': SmartPlantEater,
      '*': Plant}
      );
  runWorld(valleyTwo, 500);

  var predatorWorld = new LifelikeWorld(
      ["####################################################",
      "#                 ####         ****              ###",
      "#   *  @  ##                 ########       OO    ##",
      "#   *    ##        O O                 ****       *#",
      "#       ##*                        ##########     *#",
      "#      ##***  *         ****                     **#",
      "#* **  #  *  ***      #########                  **#",
      "#* **  #      *               #   *              **#",
      "#     ##              #   O   #  ***          ######",
      "#*            @       #       #   *        O  #    #",
      "#*                    #  ######                 ** #",
      "###          ****          ***                  ** #",
      "#       O                        @         O       #",
      "#   *     ##  ##  ##  ##               ###      *  #",
      "#   **         #              *       #####  O     #",
      "##  **  O   O  #  #    ***  ***        ###      ** #",
      "###               #   *****                    ****#",
      "####################################################"],
      {"#": Wall,
        "@": Tiger,
        "O": SmartPlantEater, // from previous exercise
        "*": Plant}
  );


  // }
} ();
