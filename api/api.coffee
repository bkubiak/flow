users = require './users'
activity = require './activity'
crawler = require './crawler'

exports.addRoutes = (app) ->

	app.get '/api/users', users.getAll
	app.get '/api/users/:id', users.getOne
	
	app.get '/api/activity', activity.add
	
	app.get '/api/crawler', crawler.run
	
	app.get '/api', (req, res) -> res.send 'Flow API'
	app.get '/api/*', (req, res) -> res.send 'Flow API'