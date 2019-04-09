var et = require('expressive-test');

var file = require('../../../lib/util/file')
  , mock = require('mock-fs')
  , fs = require('fs')
  , chai = et.chai
  , sinon = require('sinon')
  , match = sinon.match
  , sinonChai = require('sinon-chai')
  , chaiAsPromised = require("chai-as-promised")
;

chai.use(sinonChai);
chai.use(chaiAsPromised);

var eioError = new Error('File system error');
eioError.code = 'EIO';


describe("util/file", () => {

  before(function() {
    mock({
      'exists.txt': '',

      'directory': {
        'file1.txt': '',
        'file2.txt': '',
        'subdir': {}
      }
    });
  });

  after(() => mock.restore());

  describe(".stat()", () => {
    it("returns a promise for a stats object", function() {
      return expect(file.stat('exists.txt')).to.eventually.be.an.instanceOf(fs.Stats);
    });
  });


  describe(".readdir()", () => {
    it("returns a promise for a directory listing", function() {
      return expect(file.readdir('directory'))
        .to.eventually.eql(['file1.txt','file2.txt','subdir']);
    });
  });


  describe(".unlink()", () => {
    it("returns a promise to remove a file", function() {
      return file.unlink('exists.txt')
        .then(() => expect(fs.existsSync('exists.txt')).to.be.false);
    });
  });


  describe('.access()', () => {

    it('resolves when the access check passes', function() {
      return expect(file.access('exists.txt', fs.constants.F_OK)).to.be.fulfilled;
    });

    it('rejects when the access check fails', function() {
      return expect(file.access('exists.txt', fs.constants.X_OK)).to.be.rejected;
    });

  });


  describe('.rmdir()', () => {

    it('returns a promise to remove an empty directory', function() {
      return file.rmdir('directory/subdir')
        .then(() => expect(fs.existsSync('directory/subdir')).to.be.false);
    });

    it('rejects on error', function() {
      return expect(file.rmdir('directory')).to.be.rejected;
    });

  });


  describe(".exists()", () => {

    it('resolves true for paths that exist', function() {
      return expect(file.exists('exists.txt')).to.eventually.be.true;
    });

    it('resolves false for paths that do not exist', function() {
      return expect(file.exists('doesnotexist.txt')).to.eventually.be.false;
    });

    context("when an error occurs", () => {
      before(() => { sinon.stub(fs, 'access').callsArgWith(2, eioError); });

      after(() => { fs.access.restore(); });

      it('rejects with the error', function() {
        return expect(file.exists('exists.txt')).to.be.rejectedWith(eioError)
      });

    });

  });


  describe('.isDirectory()', () => {

    it('resolves true for directories', function() {
      return expect(file.isDirectory('directory')).to.eventually.be.true;
    });

    it('resolves false for plain files', function() {
      return expect(file.isDirectory('exists.txt')).to.eventually.be.false;
    });

    it('resolves false for files that do not exist', function() {
      return expect(file.isDirectory('doesnotexist.txt')).to.eventually.be.false;
    });

    context("when an error occurs", () => {
      before(() => { sinon.stub(fs, 'stat').callsArgWith(1, eioError); });

      after(() => { fs.stat.restore(); });

      it('rejects with the error', function() {
        return expect(file.isDirectory('exists.txt')).to.be.rejectedWith(eioError)
      });

    });

  });

  describe('.rmTree()', () => {

    prop('arg', 'exists.txt');

    context("non-error cases", () => {

      before(function() { return file.rmTree(this.arg); });

      context("for a file", () => {

        it("removes the file", function() {
          expect(fs.existsSync(this.arg)).to.be.false;
        });

      });

      context("for a directory", () => {

        prop('arg', 'directory');

        it("removes the directory and its contents", function() {
          expect(fs.existsSync(this.arg)).to.be.false;
        });

      });

    });

    context("error cases", () => {

      it("rejects with an error for files that do not exist", function() {
        return expect(file.rmTree('doesnotexist.txt')).to.be.rejectedWith(Error);
      });

      context("when directory removal fails", () => {

        before(() => { sinon.stub(fs, 'rmdir').callsArgWith(1, eioError); });

        after(() => { fs.rmdir.restore(); });

        it("rejects with an error", function() {
          return expect(file.rmTree('directory')).to.be.rejectedWith(eioError);
        });

      });

    });

  });

});
