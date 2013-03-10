Klass.views.Main = Backbone.View.extend
	
	templateName: 'main'
	
	events:
		'click a': 'navigate'
	
	initialize: (opts) ->
		{@menu, @domain, @views} = opts
		
		@render()
	
	render: ->
		Backbone.View.prototype.render.call @
		
		@views.top = new Klass.views.Top
			el: @$ '#top'
			model: @menu
			domain: @domain
			
		@renderSections()
		
		@views.domain = new Klass.views.Domain
			el: @$ '#domain'
			model: @domain
	
	renderSections: ->
		@views.dashboard = new Klass.views.Dashboard
			el: @$ '#content'

		@views.pageflows = new Klass.views.Pageflows
			el: @$ '#content'
			
		@views.pageviews = new Klass.views.Pageviews
			el: @$ '#content'
				
		@views.pagelinks = new Klass.views.Pagelinks
			el: @$ '#content'
		
	showSection: (section, opts) ->
		@views.domain.hide()
		@_hideAllSections()
		@$('#top').show()
		
		@menu.set 'active', section
		@views[section].show()
	
	showDomainForm: ->
		@_hideAllSections()
		@$('#top').hide()
		@views.domain.show()
	
	_hideAllSections: ->
		@$('#content > .section').hide()