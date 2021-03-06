domain = require './domain'
pageviews = require './pageviews'
pageflows = require './pageflows'
validator = require './validator'
activity = require './activity'
crawler = require './crawler'


# **addRoutes** - responsible for routing logic in api
exports.addRoutes = (app) ->
	
	app.get '/api/domain', domain.get
	app.post '/api/domain', domain.set
	app.delete '/api/domain', domain.remove
	
	app.get '/api/pageviews/:domain', pageviews.get
	app.get '/api/pageflows/:domain', pageflows.get
	app.get '/api/validator/:url', validator.validate
	
	app.get '/api/activity', activity.add
	
	app.get '/api/crawler', crawler.run
	
	app.get '/api', (req, res) -> res.send 'Flow API'
	app.get '/api/*', (req, res) -> res.send 'Flow API'