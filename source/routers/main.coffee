Klass.routers.Main = Backbone.Router.extend
	routes: 
		"dashboard":	"showDashboard"
		"section1":		"showSection1"
		"section2":		"showSection2"
		"users":		"showUsers"
		"users/*userId": "showUser"
		"*notFound":	"e404"

	initialize: (@views, @models, @collections) ->

	e404: (path) ->
		@navigate '/dashboard',
			trigger: yes

	showDashboard: ->
		@setTitle 'Dashboard'
		@views.main.hideAllSections()
		@views.main.showSection 'dashboard'
		
	showSection1: ->
		@setTitle 'Section 1'
		@views.main.hideAllSections()
		@views.main.showSection 'section1'

	showSection2: (userId) ->
		@setTitle 'Section 2'
		@views.main.hideAllSections()
		@views.main.showSection 'section2',

	showUsers: ->
		@setTitle 'Users'
		@views.main.hideAllSections()
		@views.main.showSection 'users'
		@views.users.displayAction 'viewAll',
			model: @collections.users
	
	showUser: (userId) ->
		@setTitle 'Users'
		@views.main.hideAllSections()
		@views.main.showSection 'users'
		@views.users.displayAction 'viewOne',
			model: @collections.users
			userId: userId