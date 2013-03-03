Klass.views.Dashboard = Backbone.View.extend
	
	templateName: 'dashboard'
	
	initialize: (opts) ->
		@render()
		
		@bindSlider()
	
	bindSlider: ->
		@$('.slider').slider
			range: 'min'
			animate: yes
			value: 0.50
			min: 0.01
			max: 0.99
			step: 0.01
			slide: (event, ui) =>
				@$('.slider-result .value').html ui.value