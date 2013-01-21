Klass.views.UsersViewOne = Backbone.View.extend
	
	templateName: 'usersViewOne'
	
	initialize: (opts) ->
		{userId} = opts
		@userId = parseInt userId, 10
		
		@model.fetch
			success: =>
				user = @model.get @userId
				user.fetch
					success: =>
						@render()
	
	templateHash: ->
		@model.get(@userId).toJSON()