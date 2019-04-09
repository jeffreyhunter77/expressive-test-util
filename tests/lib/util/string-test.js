require('expressive-test');

var str = require('../../../lib/util/string');

describe('util/string', () => {

  describe('underscore', function() {

    it('lower cases single words', function() {
      expect(str.underscore('Foo')).to.equal('foo');
    });

    it('lower cases and underscore separates multiple camel case words', function() {
      expect(str.underscore('FooBarEtc')).to.equal('foo_bar_etc');
    });

    it('replaces dashes with underscores', function() {
      expect(str.underscore('foo-bar-etc')).to.equal('foo_bar_etc');
    });

    it('treats capitalized initials as a separate word', function() {
      expect(str.underscore('ETCFooBar')).to.equal('etc_foo_bar');
    });

    it('does not modify underscore separated lower case words', function() {
      expect(str.underscore('etc_foo_bar')).to.equal('etc_foo_bar');
    });

  });

  describe('pluralize', function() {

    it('adds es when the word ends in s', function() {
      expect(str.pluralize('octopus')).to.equal('octopuses');
    });

    it('adds es when the word ends in ch', function() {
      expect(str.pluralize('match')).to.equal('matches');
    });

    it('adds es when the word ends in x', function() {
      expect(str.pluralize('fox')).to.equal('foxes');
    });

    it('changes a y ending to ies', function() {
      expect(str.pluralize('baby')).to.equal('babies');
    });

    it('adds an s in all other cases', function() {
      expect(str.pluralize('string')).to.equal('strings');
    });

  });

});
