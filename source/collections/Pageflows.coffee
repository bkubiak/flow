Klass.collections.Pageflows = Backbone.Collection.extend

	model: Klass.models.Pageflow
	fetched: null
	
	url: ->
		"/api/pageflows/#{@domain.get('domain')}"
	
	initialize: (attrs, @domain) ->
	
	comparator: (pageflow) ->
		pageflow.get 'count'
	
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

	getPageflowsCategory: (lowerBound, upperBound) ->
		@filter (pageflow) =>
			if upperBound?
				pageflow.get('count') >= lowerBound && pageflow.get('count') <= upperBound
			else
				pageflow.get('count') >= lowerBound
	
	getMaxCount: ->
		@last().get 'count'