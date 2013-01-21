Klass.views.UsersViewAll = Backbone.View.extend
	
	templateName: 'usersViewAll'
	
	initialize: (opts) ->
		@model.fetch
			success: =>
				@render()
	
	templateHash: ->
		users: @model.toJSON()