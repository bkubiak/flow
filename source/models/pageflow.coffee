# **Pageflow** model class storing single pageflow details
Klass.models.Pageflow = Backbone.Model.extend
	
	urlRoot: '/api/pageflows'
	
	idAttribute: 'url'