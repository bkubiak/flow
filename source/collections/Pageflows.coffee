# **Pageflows** collection class storing all pageflow models
Klass.collections.Pageflows = Backbone.Collection.extend

	model: Klass.models.Pageflow
	fetched: null
	
	# **url** - builds api url
	url: ->
		"/api/pageflows/#{@domain.get('domain')}"
	
	# **initialize** - class constructor
	#
	# * `attrs` - initial attributes
	# * `domain` - domain model
	initialize: (attrs, @domain) ->
	
	# **comparator** - used to sort models
	#
	# * `pageflow` - pageflow model
	comparator: (pageflow) ->
		pageflow.get 'count'
	
	# **fetch** - gets data from api
	#
	# * `opts` - optional param containing *success* callback
	fetch: (opts) ->
		opts = opts || {}
		
		if @fetched is @domain.get('domain')
			if opts.success?
				opts.success()
		else
			success = opts.success
			opts.success = =>
				@fetched = @domain.get 'domain'
				success()
			Backbone.Collection.prototype.fetch.call @, opts
	
	# **getPageflowsCategory** - gets pageflows category basing on lower and upper bound
	#
	# * `lowerBound` - lower bound of the category
	# * `upperBound` - upper bound of the category
	getPageflowsCategory: (lowerBound, upperBound) ->
		@filter (pageflow) =>
			if upperBound?
				pageflow.get('count') >= lowerBound && pageflow.get('count') <= upperBound
			else
				pageflow.get('count') >= lowerBound
	
	# **getMaxCount** - gets the biggest count value
	getMaxCount: ->
		@last().get 'count'