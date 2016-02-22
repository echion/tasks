'use strict';

var request = require('supertest'),
	app = require('../app');

describe('tasks', function() {
  describe('getById', function () {	
    it('should return a task', function (done) {
    	request(app)
    		.get('/tasks/2')
    		.expect('Content-Type', /json/)
    		.expect(200)
            .expect(function(res) {
                res.body.id = '2';
            })
            .end(done);
    });
  });
});