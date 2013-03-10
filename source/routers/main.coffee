Klass.routers.Main = Backbone.Router.extend
	routes: 
		"domain":		"showDomain"
		"dashboard":	"showDashboard"
		"pageflows":	"showPageflows"
		"pageflows/*category":	"showPageflowsDetails"
		"pageviews":	"showPageviews"
		"pageviews/*category":	"showPageviewsDetails"
		"pagelinks":	"showPagelinks"
		"pagelinks/*baseUrl": "showPagelinksDetails"
		"*notFound":	"e404"

	initialize: (@views, @models, @collections) ->

	e404: (path) ->
		@navigate '/dashboard', trigger: yes
	
	_navigateToDomain: ->
		@navigate '/domain', trigger: yes
	
	showDomain: ->
		unless @models.domain.has 'domain'
			@setTitle 'Domain'
			@views.main.showDomainForm()
		else
			@navigate '/dashboard', trigger: yes
	
	showDashboard: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Dashboard'
		@views.main.showSection 'dashboard'
		
	showPageflows: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageflows'
		@views.main.showSection 'pageflows'
		@views.pageflows.displayAction 'viewBasic',
			model: @collections.pageflows

	showPageflowsDetails: (category) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()

		@setTitle 'Pageflows - details'
		@views.main.showSection 'pageflows'
		@views.pageflows.displayAction 'viewDetails',
			model: @collections.pageflows
			category: category

	showPageviews: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageviews'
		@views.main.showSection 'pageviews'
		@views.pageviews.displayAction 'viewBasic',
			model: @collections.pageviews
	
	showPageviewsDetails: (category) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageviews - details'
		@views.main.showSection 'pageviews'
		@views.pageviews.displayAction 'viewDetails',
			model: @collections.pageviews
			category: category
	
	showPagelinks: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pagelinks'
		@views.main.showSection 'pagelinks'
		@views.pagelinks.displayAction 'viewBasic',
			model: @collections.pagelinks
	
	showPagelinksDetails: (baseUrl) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
			
		@setTitle 'Pagelinks - details'
		@views.main.showSection 'pagelinks'
		@views.pagelinks.displayAction 'viewDetails',
			model: @collections.pagelinks
			baseUrl: baseUrl