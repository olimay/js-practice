/**
 * Jasmine spec for Chapter 08 exercises
 */

describe("EJS 08 - \"Bugs and Error Handling\" exercises", function () {

  it("EJS08 object", function ejs08obj() {
    expect(ejs08).toEqual(jasmine.any(Object));
    expect(ejs08.retry).toEqual(jasmine.any(Function));
    expect(ejs08.lockedbox).toEqual(jasmine.any(Function));
  });

  describe("EJS08.ex1 Retry", function ex08retry() {

    var retry;

    beforeEach(function () {
      retry = new ejs08.retry();
      spyOn(retry, 'primitiveMultiply').and.callThrough();
    });

    it("Reference", function () {
      expect(retry).toEqual(jasmine.any(Object));
    });

    it("Function definitions", function () {
      expect(retry.MultiplicatorUnitFailure).toEqual(jasmine.any(Function));
      expect(retry.primitiveMultiply).toEqual(jasmine.any(Function));
      expect(retry.reliableMultiply).toEqual(jasmine.any(Function));
    });

    it("Result", function () {
      expect(retry.reliableMultiply(3,8)).toEqual(3*8);
      expect(retry.reliableMultiply(5,8)).toEqual(5*8);
      expect(retry.reliableMultiply(8,8)).toEqual(64);
    });

  });

  describe("EJS08.ex2 The Locked Box", function ex08lockedbox() {

    var lockedbox;

    beforeEach(function () {
      lockedbox = new ejs08.lockedbox();

    });

    it("has an object", function () {
      expect(lockedbox).toEqual(jasmine.any(Object));
    });

    describe("box object", function () {

      it("is an object", function () {
        expect(lockedbox.box).toEqual(jasmine.any(Object));
      });

      it("starts as locked", function () {
        expect(lockedbox.box.locked).toBe(true);
      });

      it("has an unlock method", function () {
        expect(lockedbox.box.unlock).toEqual(jasmine.any(Function));
      });

      describe("unlock()", function () {

        it("sets box.locked = false", function () {
          lockedbox.box.unlock();
          expect(lockedbox.box.locked).toBe(false);
        });

      });


      describe("content property", function () {

        it("throws an error Locked! when box is locked", function () {
          expect(lockedbox.box.locked).toBe(true);
          expect(function () {
            return lockedbox.box.content;
          }).toThrowError('Locked!');
        });

        it("returns _content when unlocked", function () {
          lockedbox.box.unlock();
          expect(lockedbox.box.locked).toBe(false);
          expect(lockedbox.box.content).toEqual(lockedbox.box._content);
        });

        it ("is a getter property", function () {
          lockedbox.box.unlock();
          this.before = lockedbox.box.content;
          lockedbox.box.content = 'a';
          expect(lockedbox.box.content).not.toEqual('a');
          expect(lockedbox.box.content).toEqual(this.before);
        });

      });

      describe ("withBoxUnlocked()", function () {

        var callback;

        beforeEach(function () {
          callback = null;
        });

        it("is a Function", function () {
          expect(lockedbox.withBoxUnlocked).toEqual(jasmine.any(Function));
        });

        it("invokes its callback argument once", function () {
          this.callback = jasmine.createSpy('callback');
          lockedbox.withBoxUnlocked(this.callback);
          expect(this.callback.calls.count()).toEqual(1);
        });

        it("unlocks box before callback is called", function () {
          var isLockedDuringCallback = null;
          this.callback = function () {
            isLockedDuringCallback = lockedbox.box.locked;
          };
          spyOn(this, 'callback').and.callThrough();
          lockedbox.withBoxUnlocked(this.callback);
          expect(this.callback.calls.count()).toEqual(1);
          expect(isLockedDuringCallback).toBe(false);
        });

        it("allows callback to access content", function () {
          var inside;
          lockedbox.withBoxUnlocked(function () {
            lockedbox.box.content.push('gold piece');
          });
          lockedbox.withBoxUnlocked(function () {
            inside = lockedbox.box.content;
          });
          expect(inside).toEqual(['gold piece']);
        });

        it("locks box after call", function () {
          lockedbox.withBoxUnlocked(function () { lockedbox.box.unlock(); });
          expect(lockedbox.box.locked).toBe(true);
        });

        it("locks box even after an error is thrown by callback", function () {
          try {
            lockedbox.withBoxUnlocked(function () {
              throw new Error('Pirates on the horizon! Abort');
            });
          } catch (e) {
            expect(lockedbox.box.locked).toBe(true);
          }
        });

      });

    });

  });

});
