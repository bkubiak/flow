#= require setup
#= require_tree routers models views collections
App.templates = (name) ->
	jade.templates[name]

App.initModels = ->
	@models.domain = new Klass.models.Domain()
	
	@models.menu = new Klass.models.Menu {}
	
	@collections.pagelinks = new Klass.collections.Pagelinks()
	
	@collections.pageviews = new Klass.collections.Pageviews {}, @models.domain
	
	@collections.pageflows = new Klass.collections.Pageflows {}, @models.domain

App.init = ->
	@initModels()
	
	@models.domain.fetch().always =>
		
		@views.main = new Klass.views.Main
			el: 'body'
			menu: @models.menu
			domain: @models.domain
			views: @views
			collections: @collections
	
		@routers.main = new Klass.routers.Main @views, @models, @collections
	
		Backbone.history.start
			pushState: yes


# Start the app, poor bastard! :)
$ ->
	App.init()