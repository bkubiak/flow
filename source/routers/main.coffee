# **Main** router class responsible for all routing logic in the application
Klass.routers.Main = Backbone.Router.extend
	routes: 
		"domain":		"showDomain"
		"dashboard":	"showDashboard"
		"pageflows":	"showPageflows"
		"pageflows/chart": "showPageflowsChart"
		"pageflows/*category":	"showPageflowsDetails"
		"pageviews":	"showPageviews"
		"pageviews/chart": "showPageviewsChart"
		"pageviews/*category":	"showPageviewsDetails"
		"validator":	"showValidator"
		"validator/*page":	"showValidatorDetails"
		"*notFound":	"e404"

	# **initialize** - class constructor
	#
	# * `views` - views instances
	# * `models` - models instances
	# * `collections`- collections instances
	initialize: (@views, @models, @collections) ->
	
	# **e404** - 404 page, redirects to */dashboard*
	e404: (path) ->
		@navigate '/dashboard', trigger: yes
	
	# **_navigateToDomain** - redirects to */domain*
	_navigateToDomain: ->
		@navigate '/domain', trigger: yes
	
	# **showDomain** - shows domain form
	showDomain: ->
		unless @models.domain.has 'domain'
			@setTitle 'Domain'
			@views.main.showDomainForm()
		else
			@navigate '/dashboard', trigger: yes
	
	# **showDashboard** - shows *dashboard* section
	showDashboard: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Dashboard'
		@views.main.showSection 'dashboard'
	
	# **showPageflows** - shows *pageflows* section and *viewBasic* action
	showPageflows: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageflows'
		@views.main.showSection 'pageflows'
		@views.pageflows.displayAction 'viewBasic',
			model: @collections.pageflows
	
	# **showPageflowsChart** - shows *pageflows* section and *viewChart* action
	showPageflowsChart: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageflows - chart'
		@views.main.showSection 'pageflows'
		@views.pageflows.displayAction 'viewChart',
			model: @collections.pageflows
	
	# **showPageflowsDetails** - shows *pageflows* section and *viewDetails* action
	#
	# * `category` - which *pageflows* category must be shown
	showPageflowsDetails: (category) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()

		@setTitle 'Pageflows - details'
		@views.main.showSection 'pageflows'
		@views.pageflows.displayAction 'viewDetails',
			model: @collections.pageflows
			category: category

	# **showPageviews** - shows *pageviews* section and *viewBasic* action
	showPageviews: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageviews'
		@views.main.showSection 'pageviews'
		@views.pageviews.displayAction 'viewBasic',
			model: @collections.pageviews
	
	# **showPageviewsChart** - shows *pageviews* section and *viewChart* action
	showPageviewsChart: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()

		@setTitle 'Pageviews - chart'
		@views.main.showSection 'pageviews'
		@views.pageviews.displayAction 'viewChart',
			model: @collections.pageviews
	
	# **showPageviewsDetails** - shows *pageviews* section and *viewDetails* action
	#
	# * `category` - which *pageviews* category must be shown
	showPageviewsDetails: (category) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Pageviews - details'
		@views.main.showSection 'pageviews'
		@views.pageviews.displayAction 'viewDetails',
			model: @collections.pageviews
			category: category
	
	# **showValidator** - shows *validator* section and *viewBasic* action
	showValidator: ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Validator'
		@views.main.showSection 'validator'
		@views.validator.displayAction 'viewBasic'
			model: @collections.pageviews
	
	# **showValidatorDetails** - shows *validator* section and *viewDetails* action
	#
	# * `page` - which *page* must be validated
	showValidatorDetails: (page) ->
		unless @models.domain.has 'domain'
			return @_navigateToDomain()
		
		@setTitle 'Validator - details'
		@views.main.showSection 'validator'
		@views.validator.displayAction 'viewDetails',
			model: @collections.validations
			page: page