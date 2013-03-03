express = require 'express'
api = require './api/api'

config =
	port: 3000
	title: 'Flow project'

Flow =
	init: () ->
		@app = express()
		
		
		
		@app.set 'view engine', 'jade'
		
		@app.use '/static', express.static __dirname + '/public'
		@app.use '/img', express.static __dirname + '/images'
		
		@app.use express.bodyParser()
		
		api.addRoutes @app
		
		@app.get '/', (req, res) -> res.render 'index', title: config.title
		@app.get '*', (req, res) -> res.render 'index', title: config.title
		
		@app.listen config.port
		
		console.log "Running development environment on http://localhost:" + config.port + "/"
	
	close: ->
		@app.close()

Flow.init()