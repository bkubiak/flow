# **Domain** view class responsible for changing domain name
Klass.views.Domain = Backbone.View.extend
	
	templateName: 'domain'
	
	events:
		'submit': 'setDomain'
	
	# **initialize** - class constructor
	initialize: (opts) ->
		@render()
	
	# **setDomain** - sets domain name that is used in project
	#
	# * `e` - user's event
	setDomain: (e) ->
		e.preventDefault()
		
		$input = @$ 'input[type=text]'
		domain = $input.val()
		
		unless domain.length
			$input.addClass('error').focus()
			return

		@model.save
			domain: $.trim $input.val()
		,
			success: =>
				$input.val ''
				@navigate '/dashboard', trigger: yes