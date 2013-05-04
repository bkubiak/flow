# **Top** view class responsible for top menu
Klass.views.Top = Backbone.View.extend
	
	templateName: 'top'
	
	events:
		'click .delete': 'deleteDomain'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{@domain} = opts
		@render()
		@model.on 'change:active', @setActive, @
		@domain.on 'change:domain', @render, @
	
	# **templateHash** - used to pass variables to template
	templateHash: ->
		menu: @model.nav
		domain: @domain.get 'domain'
	
	# **setActive** - sets active menu item
	setActive: ->
		@$('li.active').removeClass 'active'

		active = @model.get 'active'
		@$("li[data-section=#{active}]").addClass 'active'
	
	# **deleteDomain** - unsets domain name that is used in project
	deleteDomain: (e) ->
		e.preventDefault()

		@domain.destroy
			success: =>
				@domain.clear()
				@navigate '/domain'