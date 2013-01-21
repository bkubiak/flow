Klass.views.Menu = Backbone.View.extend
	
	templateName: 'menu'
	
	initialize: (opts) ->
		@render()
		@model.on 'change:active', @setActive, @
	
	templateHash: ->
		menu: @model.nav
	
	setActive: ->
		@$('li.active').removeClass 'active'

		active = @model.get 'active'
		@$("li[data-section=#{active}]").addClass 'active'