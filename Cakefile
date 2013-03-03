# Hello developer!
# This is a cakefile for Flow project
# Copyright 2012 by Bartek Kubiak

{spawn} = require 'child_process'
CoffeeScript = require 'coffee-script'
fs = require 'fs'
watch = require 'watch'
Snockets = require 'snockets'

snockets = new Snockets
	async: false

libraries = [
	'jquery-1.9.1'
	'underscore-1.4.3'
	'backbone-0.9.9'
	'backbone-ext'
	'jquery-ui-core-1.10.1'
	'jquery-ui-widget-1.10.1'
	'jquery-ui-mouse-1.10.1'
	'jquery-ui-slider-1.10.1'
]

lastBuildAppTime = 0

helpers = 
	addLeadingZero: (x) ->
		x = parseInt(x, 10)
		if 0 <= x < 10
			return '0'+x
		return x
	formatTime: (date) ->
		time = @addLeadingZero date.getHours()
		time += ':' + @addLeadingZero date.getMinutes()
		time += ':' + @addLeadingZero date.getSeconds()

task 'run', 'Run the server and watch for changes to rebuild the app', ->
	invoke 'watch-src'
	invoke 'run-server'
	
task 'run-server', 'Run the server', ->
	coffee = spawn 'coffee', ['index.coffee']
	coffee.stderr.on 'data', (data) -> console.log data.toString()
	coffee.stdout.on 'data', (data) -> console.log data.toString()

task 'watch-src', 'Watch jade and coffee files for changes', ->
	watch.watchTree 'source/libraries', {interval: 3000}, () ->
		invoke 'build-lib'
	
	watch.watchTree 'source/templates', {interval: 3000}, () ->
		invoke 'build-templates'
	
	watch.watchTree 'source/styles', {interval: 3000}, () ->
		invoke 'build-styles'
	
	watch.watchTree 'source/views', {interval: 3000}, () ->
		invoke 'build-app'
		
	watch.watchTree 'source/routers', {interval: 3000}, () ->
		invoke 'build-app'
	
	watch.watchTree 'source/models', {interval: 3000}, () ->
		invoke 'build-app'
	
	watch.watchTree 'source/collections', {interval: 3000}, () ->
		invoke 'build-app'

task 'build-app', 'Watch coffee files for changes to rebuild the app', ->
	now = +new Date()
	if now - lastBuildAppTime < 1000
		return false
	
	js = snockets.getConcatenation './source/app.coffee'
	fs.writeFileSync 'public/app.js', js
	
	# coffee = spawn 'coffee', ['-c', '-j', 'app.js', '-o', 'public/', 'source/']
	# coffee.stderr.on 'data', (data) -> console.log data.toString()
	# coffee.stdout.on 'data', (data) -> console.log data.toString()
	
	lastBuildAppTime = now
	console.log "App has been built - #{helpers.formatTime(new Date(now))}"

task 'build-templates', 'Rebuild templates', ->	
	templatesBuffer = ''
	clientjade = spawn 'clientjade', ['source/templates']
	clientjade.stderr.on 'data', (data) -> console.log data.toString()
	clientjade.stdout.on 'data', (data) -> templatesBuffer += data
	clientjade.on 'exit', (code, signal) -> fs.writeFileSync 'public/templates.js', templatesBuffer
	console.log "Templates have been built - #{helpers.formatTime(new Date())}"

task 'build-styles', 'Rebuild styles', ->	
	sass = spawn 'sass', ['source/styles/index.sass','public/style.css']
	sass.stderr.on 'data', (data) -> console.log data.toString()
	sass.stdout.on 'data', (data) -> console.log data.toString()
	console.log "Styles have been built - #{helpers.formatTime(new Date())}"

task 'build-lib', 'Build libraries into a single file', ->
	librariesBuffer = ''
	for file in libraries
		librariesBuffer += fs.readFileSync('source/libraries/'+file+'.js') + "\n\n"
	fs.writeFileSync 'public/lib.js', librariesBuffer
	console.log "Libraries have been built - #{helpers.formatTime(new Date())}"