users = require './users'
domain = require './domain'
pagelinks = require './pagelinks'
activity = require './activity'
crawler = require './crawler'


exports.addRoutes = (app) ->

	app.get '/api/users', users.getAll
	app.get '/api/users/:id', users.getOne
	
	app.get '/api/domain', domain.get
	app.post '/api/domain', domain.set
	app.delete '/api/domain', domain.remove
	
	app.get '/api/pagelinks/:domain', pagelinks.getBasic
	app.get '/api/pagelinks/:domain/:baseUrl', pagelinks.getDetails
	
	app.get '/api/activity', activity.add
	
	app.get '/api/crawler', crawler.run
	
	app.get '/api', (req, res) -> res.send 'Flow API'
	app.get '/api/*', (req, res) -> res.send 'Flow API'