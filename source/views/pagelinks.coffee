Klass.views.Pagelinks = Backbone.View.extend
	
	templateName: 'pagelinks'
	
	action: null
	
	initialize: (opts) ->
		@render()
		
		@views = {}
	
	displayAction: (action, opts) ->
		if @views[@action]?
			@views[@action].remove()
			
		@action = action
		
		if @action is 'viewDetails'
			@$('.back').show()
		else
			@$('.back').hide()
		
		opts = opts || {}
		opts.el = @$ '.tile'
		
		cls = action.substr(0, 1).toUpperCase() + action.substr(1)
		@views[action] = new Klass.views["Pagelinks#{cls}"] opts