'use strict';

var dropDatabase = require('./drop-database'),
    app;

describe('tasks', function() {
  before(function(done) {
    app = require('../../app');
    done();
  });

  beforeEach('drop database', function(done) {
    dropDatabase(done);
  });

  describe('getById', function () {	
    it('should return a task', function (done) {
    	request(app)
    		.get('/tasks/2')
    		.expect('Content-Type', /json/)
    		.expect(200)
            .expect(function(res) {
                res.body.id.should.equal('2');
            })
            .end(done);
    });
  });
});