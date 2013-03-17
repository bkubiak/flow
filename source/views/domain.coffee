Klass.views.Domain = Backbone.View.extend
	
	templateName: 'domain'
	
	events:
		'submit': 'setDomain'
	
	initialize: (opts) ->
		@render()
	
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