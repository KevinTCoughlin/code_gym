// inspired by: https://github.com/josdejong/mathjs/blob/master/test/function/probability/factorial.test.js

var assert = require('assert');
var factorial = require('../../math/factorial.js');
describe("Factorial", function() {
  it("shoiuld calculate the factorial of a number", function() {
    assert.equal(factorial(0), 1);
    assert.equal(factorial(1), 1);
    assert.equal(factorial(2), 2);
    assert.equal(factorial(3), 6);
    assert.equal(factorial(4), 24);
    assert.equal(factorial(5), 120);
  });
});
