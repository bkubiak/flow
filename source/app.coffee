# The application
App =
	views: {}
	models: {}
	collections: {}
	routers: {}

# class definitions
Klass =
	views: {}
	models: {}
	collections: {}
	routers: {}

App.templates = (name) ->
	jade.templates[name]

App.initModels = ->
	@models.menu = new Klass.models.Menu {}

App.init = ->
	@initModels()
	
	@views.main = new Klass.views.Main
		el: 'body'
		menu: @models.menu
	
	@routers.main = new Klass.routers.Main @views, @models, @collections
	
	Backbone.history.start
		pushState: yes


# Start the app, poor bastard! :)
$ ->
	#export App variable
	window['App'] = App
	
	# Start the app
	App.init()