users = require './users'

exports.addRoutes = (app) ->

	app.get '/api/users', users.getAll
	app.get '/api/users/:id', users.getOne
	
	app.get '/api', (req, res) -> res.send 'Flow API'
	app.get '/api/*', (req, res) -> res.send 'Flow API'