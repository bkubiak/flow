Klass.views.PagelinksViewBasic = Backbone.View.extend
	
	templateName: 'pagelinksViewBasic'
	
	initialize: (opts) ->
		@model.fetch
			success: =>
				@render()