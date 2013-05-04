# **Pageviews** collection class storing all pageview models
Klass.collections.Pageviews = Backbone.Collection.extend

	model: Klass.models.Pageview
	fetched: null
	
	# **url** - builds api url
	url: ->
		"/api/pageviews/#{@domain.get('domain')}"
	
	# **initialize** - class constructor
	#
	# * `attrs` - initial attributes
	# * `domain` - domain model
	initialize: (attrs, @domain) ->
	
	# **comparator** - used to sort models
	#
	# * `pageview` - pageview model
	comparator: (pageview) ->
		pageview.get 'count'
	
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

	# **getPageviewsCategory** - gets pageviews category basing on lower and upper bound
	#
	# * `lowerBound` - lower bound of the category
	# * `upperBound` - upper bound of the category
	getPageviewsCategory: (lowerBound, upperBound) ->
		@filter (pageview) =>
			if upperBound?
				pageview.get('count') >= lowerBound && pageview.get('count') <= upperBound
			else
				pageview.get('count') >= lowerBound
	
	# **getMaxCount** - gets the biggest count value
	getMaxCount: ->
		@last().get 'count'