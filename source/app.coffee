#= require setup
#= require_tree routers models views collections
App.templates = (name) ->
	jade.templates[name]

App.initModels = ->
	@models.menu = new Klass.models.Menu {}
	
	@collections.users = new Klass.collections.Users()

App.init = ->
	@initModels()
	
	@views.main = new Klass.views.Main
		el: 'body'
		menu: @models.menu
		views: @views
	
	@routers.main = new Klass.routers.Main @views, @models, @collections
	
	Backbone.history.start
		pushState: yes


# Start the app, poor bastard! :)
$ ->
	App.init()