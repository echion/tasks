function add(req, res, next) {

}

function getById(req, res, next) {
	res.json({
		id: req.params.id,
		name: 'Do it!'
	});
}

function getAll(req, res, next) {

}

function remove(req, res, next) {

}

module.exports = function(router) {
  	'use strict';

	// This will handle the url calls for /users/:user_id
	router
		.route('/tasks/:id')
		.get(getById) 
		.delete(remove);

	router
		.route('/tasks/')
		.get(function(req, res, next) {
			
		}).post(add);
};