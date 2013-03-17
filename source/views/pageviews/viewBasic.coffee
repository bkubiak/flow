Klass.views.PageviewsViewBasic = Backbone.View.extend
	
	templateName: 'pageviewsViewBasic'
	
	isEmpty: no
	
	initialize: (opts) ->
		@model.fetch
			success: =>
				@isEmpty = no
				@render()
			error: =>
				@isEmpty = yes
				@render()
	
	templateHash: ->
		isEmpty: @isEmpty
		cat1Count: @model.getPageviewsCategory(1, 5).length
		cat2Count: @model.getPageviewsCategory(6, 10).length
		cat3Count: @model.getPageviewsCategory(11, 50).length
		cat4Count: @model.getPageviewsCategory(51, 100).length
		cat5Count: @model.getPageviewsCategory(101, 500).length
		cat6Count: @model.getPageviewsCategory(501, 1000).length
		cat7Count: @model.getPageviewsCategory(1001).length