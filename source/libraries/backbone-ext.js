_.extend(Backbone.View.prototype, {
	rendered: false,
	templateName: null,
	
	navigate: function(e, opts) {
		var isEvent, path;

		isEvent = (typeof(e.isDefaultPrevented) !== 'undefined');

		if (!isEvent || e.isDefaultPrevented() !== true) {
			path = (isEvent) ? $(e.currentTarget).attr('href') : e;

			App.routers.main.navigate(path, {trigger: true});
			
			if (isEvent)
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
		var content;
		if (this.templateName === null) {
			return false;
		}
		
		tpl = this.template(this.templateName);
		
		if (this.rendered === false) {
			this.$el.append(tpl(this.templateHash()));
			this.setElement(this.$el.find('> :last-child'));
			this.rendered = true;
		}
		else {
			content = $(tpl(this.templateHash())).html();
			this.$el.html(content);
		}
		return true;
	},
	
	show: function() {
		this.$el.show();
	},
	
	hide: function() {
		this.$el.hide();
	},
	
	remove: function() {
		if (this.rendered) {
			this.$el.remove();
		}
		this.stopListening();
		return this;
	}
	
});

_.extend(Backbone.Router.prototype, {
	
	setTitle: function(title) {
		document.title = title;
	}
	
});