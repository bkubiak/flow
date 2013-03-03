Klass.views.PagelinksViewBasic = Backbone.View.extend
	
	templateName: 'pagelinksViewBasic'
	
	initialize: (opts) ->
		@model.fetch
			success: =>
				@render()
	
	templateHash: ->
		urls: for item in @model.toJSON()
			url: item.url
			encodedUrl: encodeURIComponent item.url