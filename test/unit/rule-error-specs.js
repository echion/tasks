'use strict';

describe('RuleError', function() {
    var RuleError = require('../../models/rule-error'),
        error = new RuleError('oops', 400),
        util = require('util');

    it('should evaluate as an error', function(done) {
        util.isError(error).should.be.true();

        done();
    });
});