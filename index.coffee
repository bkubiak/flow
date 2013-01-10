express = require 'express'

config =
	port: 3000
	title: 'Flow project'

App =
	init: () ->
		@serv = express.createServer()
		
		@serv.set 'view engine', 'jade'
		
		@serv.use '/static', express.static __dirname + '/public'
		@serv.use '/img', express.static __dirname + '/images'
		
		@serv.get '/', (req, res) -> res.render 'index', title: config.title
		@serv.get '*', (req, res) -> res.render 'index', title: config.title
		
		@serv.listen config.port
		
		console.log "Running development environment on http://localhost:" + config.port + "/"
	
	close: ->
		@serv.close()

App.init()