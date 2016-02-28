module.exports = function(router) {
  	'use strict';

	router.get('/tasks', function(req, res) {

	});

	router.get('/tasks/:id', function(req, res) {
		res.json({
			id: req.params.id,
			name: 'Do it!'
		});
	});

	router.post('/tasks', function(req, res) {

	});

	router.delete('/tasks/:id', function(req, res) {

	});
};