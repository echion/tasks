'use strict';

describe('error logger', function() {
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
        errorHandler = require('../../error-handlers/error-logger');

    it('should call next for any error', function(done) {
        var error = {},
            next = sinon.spy();

        errorHandler(error, request, response, next);

        next.called.should.be.true();
        next.calledWith(error).should.be.true();

        done();
    });
});