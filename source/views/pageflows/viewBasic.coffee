Klass.views.PageflowsViewBasic = Backbone.View.extend
	
	templateName: 'pageflowsViewBasic'
	
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
		cat1Count: @model.getPageflowsCategory(1, 5).length
		cat2Count: @model.getPageflowsCategory(6, 10).length
		cat3Count: @model.getPageflowsCategory(11, 50).length
		cat4Count: @model.getPageflowsCategory(51, 100).length
		cat5Count: @model.getPageflowsCategory(101, 500).length
		cat6Count: @model.getPageflowsCategory(501, 1000).length
		cat7Count: @model.getPageflowsCategory(1001).length
		