Klass.routers.Main = Backbone.Router.extend
	routes: 
		"dashboard":	"dashboard"
		"section1":		"section1"
		"section2":		"section2"
		"section3":		"section3"
		"*notFound":	"e404"

	initialize: (@views, @models, @collections) ->

	e404: (path) ->
		@navigate '/dashboard',
			trigger: yes

	dashboard: ->
		@setTitle 'Dashboard'
		@views.main.hideAllSections()
		@views.main.showSection 'dashboard'
		
	section1: ->
		@setTitle 'Section 1'
		@views.main.hideAllSections()
		@views.main.showSection 'section1'

	section2: ->
		@setTitle 'Section 2'
		@views.main.hideAllSections()
		@views.main.showSection 'section2'

	section3: ->
		@setTitle 'Section 3'
		@views.main.hideAllSections()
		@views.main.showSection 'section3'
		