Klass.views.Main = Backbone.View.extend
	
	templateName: 'main'
	
	events:
		'click a': 'navigate'
	
	initialize: (opts) ->
		{@menu, @views} = opts
		
		@render()
	
	render: ->
		Backbone.View.prototype.render.call @

		@views.top = new Klass.views.Menu
			el: @$ '#menu'
			model: @menu
			
		@renderSections()
	
	renderSections: ->
		@views.dashboard = new Klass.views.Dashboard
			el: @$ '#content'

		@views.section1 = new Klass.views.Section1
			el: @$ '#content'
			
		@views.section2 = new Klass.views.Section2
			el: @$ '#content'
				
		@views.users = new Klass.views.Users
			el: @$ '#content'
	
	hideAllSections: ->
		@$('#content > .section').hide()
		
	showSection: (section, opts) ->
		@menu.set 'active', section
		@views[section].show opts