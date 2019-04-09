var et = require('expressive-test');

var prom = require('../../../lib/util/promise')
  , sinon = require('sinon')
  , chai = et.chai
  , sinonChai = require('sinon-chai')
  , chaiAsPromised = require("chai-as-promised")
;

chai.use(sinonChai);
chai.use(chaiAsPromised);

function nextTick() {
  return new Promise(resolve => process.nextTick(resolve));
}

function waitForMilliseconds(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function resolvesNow() {
  return nextTick().then(() => true);
}

function rejectsNow() {
  return nextTick().then(() => {throw new Error('failure')});
}

function rejectsAfter(ms) {
  return waitForMilliseconds(ms).then(() => {throw new Error('failure')});
}


describe("util/promise", () => {

  describe("asPromise()", () => {

    prop('error', new Error('failure'));
    prop('result', 100);

    prop('callbackError', function() {
      return function(cb) { process.nextTick(() => cb(this.error)); };
    });

    prop('callbackResult', function() {
      return function(cb) { process.nextTick(() => cb(undefined, this.result)); };
    });

    it("provides a function whose first argument rejects", function() {
      return expect(prom.asPromise(cb => this.callbackError(cb)))
        .to.be.rejectedWith(this.error);
    });

    it ("provides a function whose second argument resolves", function() {
      return expect(prom.asPromise(cb => this.callbackResult(cb)))
        .to.eventually.equal(this.result);
    });

  });


  describe("promiseEach()", () => {

    prop('items', [sinon.spy(), sinon.spy(), sinon.spy()]);

    it("returns a promise to perform an operation on each item in the collection", function() {
      return prom.promiseEach(this.items, item => item())
        .then(() => this.items.forEach((item) => expect(item).to.have.been.called))
    });

    it("rejects if any of the items throw", function() {
      return expect(prom.promiseEach(this.items, item => { throw new Error('!!'); }))
        .to.be.rejectedWith(Error);
    });

    it("rejects if any of the items reject", function() {
      return expect(prom.promiseEach(this.items, item => Promise.reject(new Error('!!'))))
        .to.be.rejectedWith(Error);
    });
  });


  describe("withinTimeout()", () => {

    it("resolves when the promise resolves in time", function() {
      return expect(prom.withinTimeout(2, resolvesNow())).to.eventually.be.true;
    });

    it("rejects when the promise rejects in time", function() {
      return expect(prom.withinTimeout(2, rejectsNow())).to.be.rejectedWith('failure');
    });

    it("rejects when the promise does not resolve or reject in time", function() {
      return expect(prom.withinTimeout(1, rejectsAfter(2))).to.be.rejectedWith('Timed out');
    });

  });

});
