#= require setup
#= require_tree routers models views collections
App.templates = (name) ->
	jade.templates[name]

# models initialization
App.initModels = ->
	@models.domain = new Klass.models.Domain()
	
	@models.menu = new Klass.models.Menu {}
	
	@collections.pageviews = new Klass.collections.Pageviews {}, @models.domain
	
	@collections.pageflows = new Klass.collections.Pageflows {}, @models.domain
	
	@collections.validations = new Klass.collections.Validations {}
	
	@models.graph = new Klass.models.Graph {}, @collections.pageviews, @collections.pageflows

# application initialization
App.init = ->
	@initModels()
	
	@models.domain.fetch().always =>
		
		@views.main = new Klass.views.Main
			el: 'body'
			menu: @models.menu
			domain: @models.domain
			graph: @models.graph
			views: @views
	
		@routers.main = new Klass.routers.Main @views, @models, @collections
	
		Backbone.history.start
			pushState: yes


# Start the app!
$ ->
	App.init()