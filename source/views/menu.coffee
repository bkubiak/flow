Klass.views.Menu = Backbone.View.extend
	
	templateName: 'menu'
	
	initialize: (opts) ->
		@render()
	
	templateHash: ->
		menu: @model.nav