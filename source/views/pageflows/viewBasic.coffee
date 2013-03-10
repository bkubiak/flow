Klass.views.PageflowsViewBasic = Backbone.View.extend
	
	templateName: 'pageflowsViewBasic'
	
	isEmpty: no
	
	initialize: (opts) ->
		@model.fetch
			success: =>
				@isEmpty = no
				@render()
			error: =>
				@isEmpty = yes
				@render()
	
	templateHash: ->
		isEmpty: @isEmpty