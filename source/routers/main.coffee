Klass.routers.Main = Backbone.Router.extend
	routes: 
		"domain":		"showDomain"
		"dashboard":	"showDashboard"
		"section1":		"showSection1"
		"section2":		"showSection2"
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
		
	showSection1: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Section 1'
		@views.main.showSection 'section1'

	showSection2: (userId) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Section 2'
		@views.main.showSection 'section2'

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