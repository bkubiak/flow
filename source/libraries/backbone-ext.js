_.extend(Backbone.View.prototype, {
	rendered: false,
	templateName: null,
	
	navigate: function(e, opts) {
		var isEvent, path;

		isEvent = (typeof(e.isDefaultPrevented) !== 'undefined');

		if (!isEvent || e.isDefaultPrevented() !== true) {
			path = $(e.currentTarget).attr('href');
			App.routers.main.navigate(path, {trigger: true});
		
			e.preventDefault();
		}
	},
	
	template: function(name) {
		return App.templates(name);
	},
	
	templateHash: function() {
		return {};
	},
	
	render: function() {
		if (this.templateName === null) {
			return false;
		}
		
		tpl = this.template(this.templateName);
		
		if (this.rendered === false) {
			this.$el.append(tpl(this.templateHash()));
			this.setElement(this.$el.find('> :last-child'));
		}
		return true;
	},
	
	show: function() {
		this.$el.show();
	}
	
});

_.extend(Backbone.Router.prototype, {
	
	setTitle: function(title) {
		document.title = title;
	}
	
});