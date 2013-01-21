Klass.views.Users = Backbone.View.extend
	
	templateName: 'users'
	
	action: null
	
	initialize: (opts) ->
		@render()
		
		@views = {}
	
	displayAction: (action, opts) ->
		if @views[@action]?
			@views[@action].remove()
		
		@action = action
		
		if @action is 'viewOne'
			@$('.back').show()
		else
			@$('.back').hide()
		
		opts = opts || {}
		opts.el = @$ '.tile'
		
		cls = action.substr(0, 1).toUpperCase() + action.substr(1)
		@views[action] = new Klass.views["Users#{cls}"] opts