# **Pageviews** view class
Klass.views.Pageviews = Backbone.View.extend
	
	templateName: 'pageviews'
	
	action: null
	
	# **initialize** - initializes Pageviews class
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

		if @action is 'viewDetails' or @action is 'viewChart'
			@$('.back').show()
		else
			@$('.back').hide()

		opts = opts || {}
		opts.el = @$ '.tile'

		cls = action.substr(0, 1).toUpperCase() + action.substr(1)
		@views[action] = new Klass.views["Pageviews#{cls}"] opts