var assert = require('assert');
describe('SfForms', function() {
  describe('#printId()', function() {
    it('should print "id"', function() {
      var sfForms = new sfForms('id');
      assert.equal('id', sfForms.printId());
    });
  });
});