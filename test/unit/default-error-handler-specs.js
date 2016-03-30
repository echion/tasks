'use strict';

describe('default error handler', function() {
    var sinon = require('sinon'),
        httpMocks = require('node-mocks-http'),
        request  = httpMocks.createRequest({
            method: 'GET',
            url: '/results/1',
            params: {
                id: 1
            }
        }),
        response = httpMocks.createResponse(),
        errorHandler = require('../../error-handlers/default-error-handler');

    it('should not call next for any error', function(done) {
        var error = { message: 'an error occurred' },
            next = sinon.spy();

        errorHandler(error, request, response, next);

        next.called.should.be.false();

        done();
    });
});