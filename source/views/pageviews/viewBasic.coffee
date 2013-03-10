Klass.views.PageviewsViewBasic = Backbone.View.extend
	
	templateName: 'pageviewsViewBasic'
	
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