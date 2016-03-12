'use strict';

var dropDatabase = require('./drop-database'),
    app,
    agent;

describe('tag routes', function() {
  var tag;

  before('init app', function(done) {
    app = require('../../app');
    done();
  });

  beforeEach('drop database', function(done) {
    dropDatabase(done);
  });

  beforeEach('init agent', function(done) {
    agent = request.agent(app);
    done();
  });

  beforeEach('add test data', function(done) {
    agent
      .post('/tags')
      .send({ name: 'Test tag' })
      .expect(201)
      .expect(function(res) {
        tag = res.body;
      })
      .end(done);
  }); 

  it('get all should return tag', function(done) {
    agent
      .get('/tags')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(function(res) {
          res.body[0].id.should.equal(tag.id);
      })
      .end(done);
  });

  it('getById should return a tag', function (done) {
  	agent
  		.get('/tags/' + tag.id)
      .expect(200)
      .expect('Content-Type', /json/)
  		.expect(function(res) {
          res.body.id.should.equal(tag.id);
      })
      .end(done);
  });

  it('getById with missing id should return not found', function(done) {
    agent
      .get('/tags/56d7a61f1364243923250138')
      .expect(404)
      .end(done);
  });

  it('getById with invalid id should return bad request', function(done) {
    agent
      .get('/tags/5')
      .expect(400)
      .end(done);
  });

  it('post should add a tag', function(done) {
    agent
      .post('/tags')
      .send({ name: 'another new tag'})
      .expect(201)
      .expect(function(res) {
        res.body.should.have.property('id');
      })
      .end(function() {
        agent
          .get('/tags/' + tag.id)
          .expect(200)
          .end(done);
      });
  });

  it('post with existing should return tag', function(done) {
    agent
      .post('/tags')
      .send({ name: tag.name })
      .expect(200)
      .expect(function(res) {
        res.body.id.should.equal(tag.id);
        res.body.name.should.equal(tag.name);
      })
      .end(done);
  });

  it('put should update a tag', function(done) {
    agent
      .put('/tags/' + tag.id)
      .send({ name: 'name2'})
      .expect(200)
      .expect(function(res) {
        res.body.name.should.equal('name2');
      })
      .end(function() {
        agent
          .get('/tags/' + tag.id)
          .expect(200)
          .expect(function(res) {
            res.body.name.should.equal('name2');
          })
          .end(done);
      });
  });

  it('post with missing name should return bad request', function(done) {
    agent
      .post('/tags')
      .send({ })
      .expect(400)
      .end(done);
  });

  it('put with missing name should return bad request', function(done) {
    agent
      .put('/tags/' + tag.id)
      .send({ })
      .expect(400)
      .end(done);
  });

  it('post with invalid property should return bad request', function(done) {
    agent
      .post('/tags')
      .send({ desc: 'stuff' })
      .expect(400)
      .end(done);
  });


  it('post with invalid property should return bad request', function(done) {
    agent
      .put('/tags/' + tag.id)
      .send({ desc: 'stuff' })
      .expect(400)
      .end(done);
  });

  it('delete should remove tag', function(done) {
    agent
      .delete('/tags/' + tag.id)
      .expect(204)
      .end(function() {
        agent
          .get('/tags/' + tag.id)
          .expect(404)
          .end(done);
      });         
  });

  it('delete with invalid id should return bad request', function(done) {
    agent
      .delete('/tags/5')
      .expect(400)
      .end(done);
  });
});