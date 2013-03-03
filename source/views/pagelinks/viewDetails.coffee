Klass.views.PagelinksViewDetails = Backbone.View.extend
	
	templateName: 'pagelinksViewDetails'
	
	initialize: (opts) ->
		{baseUrl} = opts
		@baseUrl = decodeURIComponent baseUrl
		
		@model.fetch
			success: _.bind @fetch, @
	
	fetch: ->
		pagelink = @model.get @baseUrl

		unless pagelink
			@navigate '/pagelinks'
			return
		
		pagelink.fetch
			success: =>
				@render()
	
	templateHash: ->
		@model.get(@baseUrl).toJSON()