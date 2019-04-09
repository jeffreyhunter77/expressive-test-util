var et = require('expressive-test');

var exec = require('../../../lib/util/exec')
  , proc = require('child_process')
  , chai = et.chai
  , sinon = require('sinon')
  , match = sinon.match
  , sinonChai = require('sinon-chai')
  , chaiAsPromised = require("chai-as-promised")
;

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe("util/exec", () => {

  describe('.exec()', function() {

    prop('stdout', {});
    prop('stderr', {});

    before(function() {
      sinon.stub(proc, 'exec').callsArgWith(1, this.error, this.stdout, this.stderr);
    });

    after(function() { proc.exec.restore(); });

    it('resolves an object with stdout', function() {
      return expect(exec.exec('echo')).to.eventually.have.property('stdout', this.stdout);
    });

    it('resolves an object with stderr', function() {
      return expect(exec.exec('echo')).to.eventually.have.property('stdout', this.stdout);
    });

    context('when an error occurs', () => {

      prop('error', function() { return new Error('oops!'); }, {memoize: true});

      it('rejects with an error', function() {
        return expect(exec.exec('echo')).to.be.rejectedWith(this.error);
      });

      it('rejects and provides stdout on the error', function() {
        return exec.exec('echo').catch((e) => expect(e.stdout).to.equal(this.stdout));
      });

      it('rejects and provides stderr on the error', function() {
        return exec.exec('echo').catch((e) => expect(e.stderr).to.equal(this.stderr));
      });

    });

  });


  describe('.quote()', function() {

    it('places single quotes around value', function() {
      expect(exec.quote('value')).to.equal("'value'");
    });

    it('surrounds any single quotes with double quotes', function() {
      expect(exec.quote("it's Ed's")).to.equal("'it'\"'\"'s Ed'\"'\"'s'");
    });

    it('converts non-string values to strings', function() {
      expect(exec.quote(100)).to.equal("'100'");
    });

  });

});
