/**
 * Eloquent JS Exercises
 * Chapter 08: Bugs and Error Handling
 */
var ejs08 = Object.create(null);

ejs08.retry = function Retry() {

  function MultiplicatorUnitFailure() {}

  function primitiveMultiply(a, b) {
    if (Math.random() < 0.5) {
      throw new MultiplicatorUnitFailure();
    }
    return a * b;
  }

  function reliableMultiply(a, b) {
    while (1) {
      try {
        return primitiveMultiply(a, b);
      } catch (e) {
      }
    }
  }

  this.MultiplicatorUnitFailure = MultiplicatorUnitFailure;
  this.primitiveMultiply = primitiveMultiply;
  this.reliableMultiply = reliableMultiply;

};

ejs08.lockedbox = function LockedBox() {

  this.box = {
    locked: true,
    unlock: function () { this.locked = false; },
    lock: function () { this.locked = true; },
    _content: [],
    get content () {
      if (this.locked) {
        throw new Error('Locked!');
      }
      return this._content;
    }
  };

  function withBoxUnlocked(body) {
    var lockedStatus = this.box.locked;
    this.box.locked = false;
    if (body instanceof Function) {
      try {
        body();
      } finally {
        this.box.locked = lockedStatus;
      }
    }
  }

  this.withBoxUnlocked = withBoxUnlocked.bind(this);

}
