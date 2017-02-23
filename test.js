var assert = require("assert");
var library = require('./index.js');

describe('Library', function() {
	it('should be an object', function() {
		assert.equal(typeof library, 'object');
	});
	describe('Functions', function() {
		describe('array', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.array, 'function');
	        });
		});
		describe('bool', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.bool, 'function');
	        });
		});
		describe('decimal', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.decimal, 'function');
	        });
		});
		describe('date', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.date, 'function');
	        });
		});
		describe('err', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.err, 'function');
	        });
		});
		describe('fn', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.fn, 'function');
	        });
		});
		describe('integer', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.integer, 'function');
	        });
		});
		describe('obj', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.obj, 'function');
	        });
		});
		describe('regex', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.regex, 'function');
	        });
		});
		describe('string', function() {
	        it('should be a function', function() {
		        assert.equal(typeof library.string, 'function');
	        });
	        it('should return an object', function() {
                assert.equal(typeof library.string('1'), 'object');
	        });
	        
assert.equal(typeof library.string('1').valid, 'boolean');
assert.equal(library.string().valid, false);
assert.equal(library.string(false).valid, false);
assert.equal(library.string(0).valid, false);
assert.equal(library.string(null).valid, false);
assert.equal(library.string({}).valid, false);
assert.equal(library.string([]).valid, false);
assert.equal(library.string('STRING').valid, true);

assert.equal(library.string('STRING').minLen(1).valid, true);
assert.equal(library.string('STRING').minLen(6).valid, true);
assert.equal(library.string('STRING').minLen(7).valid, false);

assert.equal(library.string('STRING').maxLen(7).valid, true);
assert.equal(library.string('STRING').maxLen(6).valid, true);
assert.equal(library.string('STRING').maxLen(1).valid, false);

assert.equal(library.string('STRING').fullLen(6).valid, true);
assert.equal(library.string('STRING').fullLen(7).valid, false);
assert.equal(library.string('STRING').fullLen(1).valid, false);

assert.equal(library.string('STRING').parse.valid, false);
assert.equal(library.string('{"test": true}').parse.valid, true);

assert.equal(library.string('STRING').minLen(1).maxLen(6).valid, true);
assert.equal(library.string('STRING').minLen(1).maxLen(7).valid, true);
assert.equal(library.string('STRING').minLen(1).maxLen(1).valid, false);

assert.equal(library.string('STRING').maxLen(6).minLen(1).valid, true);
assert.equal(library.string('STRING').maxLen(7).minLen(1).valid, true);
assert.equal(library.string('STRING').maxLen(1).minLen(1).valid, false);


		});
	});
});
