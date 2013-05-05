# **Validation** model class storing validation results of specific page
Klass.models.Validation = Backbone.Model.extend
	
	# **url** - builds api url
	url: ->
		'/api/validator/' + encodeURIComponent @get 'page'
	
	idAttribute: 'page'