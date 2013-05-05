# **Main** view class responsible for rendering all main sections and top menu
Klass.views.Main = Backbone.View.extend
	
	templateName: 'main'
	
	events:
		'click a': 'navigate'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		{@menu, @domain, @views, @graph} = opts
		
		@render()
	
	# **render** - renders view
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
	
	# **renderSections** - renders all sections
	renderSections: ->
		@views.dashboard = new Klass.views.Dashboard
			el: @$ '#content'
			model: @graph
			domain: @domain

		@views.pageflows = new Klass.views.Pageflows
			el: @$ '#content'
			
		@views.pageviews = new Klass.views.Pageviews
			el: @$ '#content'
		
		@views.validator = new Klass.views.Validator
			el: @$ '#content'
	
	# **showSection** - shows specific section
	#
	# * `section` - which section must be shown
	showSection: (section) ->
		@views.domain.hide()
		@_hideAllSections()
		@$('#top').show()
		
		@menu.set 'active', section
		@views[section].show()
	
	# **showDomainForm** - shows form to change domain name
	showDomainForm: ->
		@_hideAllSections()
		@$('#top').hide()
		@views.domain.show()
	
	# **_hideAllSections** - hides all sections
	_hideAllSections: ->
		@$('#content > .section').hide()