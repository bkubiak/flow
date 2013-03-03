Klass.views.Top = Backbone.View.extend
	
	templateName: 'top'
	
	events:
		'click .delete': 'deleteDomain'
	
	initialize: (opts) ->
		{@domain} = opts
		@render()
		@model.on 'change:active', @setActive, @
		@domain.on 'change:domain', @render, @
	
	templateHash: ->
		menu: @model.nav
		domain: @domain.get 'domain'
	
	setActive: ->
		@$('li.active').removeClass 'active'

		active = @model.get 'active'
		@$("li[data-section=#{active}]").addClass 'active'
	
	deleteDomain: (e) ->
		e.preventDefault()

		@domain.destroy
			success: =>
				@domain.clear()
				@navigate '/domain'