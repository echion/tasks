'use strict';

var dropDatabase = require('./drop-database');

describe('task model', function() {
  var taskModel = require('../../models/task');

  before('init app', function(done) {
    require('../../app');
    done();
  });

  beforeEach('drop database', function(done) {
    dropDatabase(done);
  });

  it('find all with no filter should still return results', function(done) {
    taskModel.findAsync()
	    	     .then(function(tasks) {
	    	 	      tasks.should.be.empty();
	    	 	      done();
	    	     });
  });
});