# **Pageview** model class storing single pageview details
Klass.models.Pageview = Backbone.Model.extend
	
	urlRoot: '/api/pageviews'
	
	idAttribute: 'url'