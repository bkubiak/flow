# **Validator** view class responsible for *Validator* section
Klass.views.Validator = Backbone.View.extend
	
	templateName: 'validator'
	
	action: null
	
	# **initialize** - class constructor
	initialize: (opts) ->
		@render()
	
		@views = {}

	# **displayAction** - displays specific action by creating a new view
	#
	# * `action` can be *viewDetails* or *viewBasic*
	# * `opts` is passed to created view's constructor
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
		@views[action] = new Klass.views["Validator#{cls}"] opts