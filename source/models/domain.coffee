# **Domain** model class storing currently selected domain name that is used in the project
Klass.models.Domain = Backbone.Model.extend
	
	url: '/api/domain'
	
	idAttribute: '_id'