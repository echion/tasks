'use strict';

var dropDatabase = require('./drop-database');

describe('tag routes', function() {
  var taskModel = require('../../models/task');

  before('init app', function(done) {
    require('../../app');
    done();
  });

  beforeEach('drop database', function(done) {
    dropDatabase(done);
  });

  it('get all with undefined filter should still return', function(done) {
    taskModel.findAsync()
	    	 .then(function(tasks) {
	    	 	tasks.should.be.empty();
	    	 	done();
	    	 });
  });
});