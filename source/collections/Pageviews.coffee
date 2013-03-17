Klass.collections.Pageviews = Backbone.Collection.extend

	model: Klass.models.Pageview
	fetched: null
	
	url: ->
		"/api/pageviews/#{@domain.get('domain')}"
	
	initialize: (attrs, @domain) ->
	
	comparator: (pageview) ->
		pageview.get 'count'
	
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

	getPageviewsCategory: (lowerBound, upperBound) ->
		@filter (pageview) =>
			if upperBound?
				pageview.get('count') >= lowerBound && pageview.get('count') <= upperBound
			else
				pageview.get('count') >= lowerBound
	
	getMaxCount: ->
		@last().get 'count'