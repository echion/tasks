'use strict';

describe('validation error handler', function() {
  var sinon = require('sinon'),
      httpMocks = require('node-mocks-http'),
      validation = require('express-validation'),
      request  = httpMocks.createRequest({
          method: 'GET',
          url: '/results/1',
          params: {
            id: 1
          }
      }),
      response = httpMocks.createResponse(),
      errorHandler = require('../../error-handlers/validation-error-handler');

  it('should handle validation errors', function(done) {
    var error = new validation.ValidationError([], {}),
        next = sinon.spy();

    errorHandler(error, request, response, next);

    next.called.should.not.be.true();

    done();
  });

  it('should only handle validation errors', function(done) {
    var error = new Error('oops'),
        next = sinon.spy();

    errorHandler(error, request, response, next);

    next.called.should.be.true();
    next.calledWith(error).should.be.true();

    done();
  });
});