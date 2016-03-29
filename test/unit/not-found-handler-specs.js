'use strict';

describe('not found error handler', function() {
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
        errorHandler = require('../../error-handlers/not-found-handler');

    it('should handle neo4j not found errors', function(done) {
        var error = { statusCode: 404 },
            next = sinon.spy();

        errorHandler(error, request, response, next);

        next.called.should.not.be.true();

        done();
    });

    it('should only handle validation errors', function(done) {
        var error = {},
            next = sinon.spy();

        errorHandler(error, request, response, next);

        next.called.should.be.true();
        next.calledWith(error).should.be.true();

        done();
    });
});