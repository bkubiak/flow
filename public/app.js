(function() {
  var App, Klass;

  App = {
    views: {},
    models: {},
    collections: {},
    routers: {}
  };

  Klass = {
    views: {},
    models: {},
    collections: {},
    routers: {}
  };

  window['App'] = App;

  window['Klass'] = Klass;

}).call(this);

(function() {

  Klass.routers.Main = Backbone.Router.extend({
    routes: {
      "dashboard": "showDashboard",
      "section1": "showSection1",
      "section2": "showSection2",
      "users": "showUsers",
      "users/*userId": "showUser",
      "*notFound": "e404"
    },
    initialize: function(views, models, collections) {
      this.views = views;
      this.models = models;
      this.collections = collections;
    },
    e404: function(path) {
      return this.navigate('/dashboard', {
        trigger: true
      });
    },
    showDashboard: function() {
      this.setTitle('Dashboard');
      this.views.main.hideAllSections();
      return this.views.main.showSection('dashboard');
    },
    showSection1: function() {
      this.setTitle('Section 1');
      this.views.main.hideAllSections();
      return this.views.main.showSection('section1');
    },
    showSection2: function(userId) {
      this.setTitle('Section 2');
      this.views.main.hideAllSections();
      return this.views.main.showSection('section2');
    },
    showUsers: function() {
      this.setTitle('Users');
      this.views.main.hideAllSections();
      this.views.main.showSection('users');
      return this.views.users.displayAction('viewAll', {
        model: this.collections.users
      });
    },
    showUser: function(userId) {
      this.setTitle('Users');
      this.views.main.hideAllSections();
      this.views.main.showSection('users');
      return this.views.users.displayAction('viewOne', {
        model: this.collections.users,
        userId: userId
      });
    }
  });

}).call(this);

(function() {

  Klass.models.Menu = Backbone.Model.extend({
    nav: {
      'dashboard': {
        label: 'Dashboard'
      },
      'section1': {
        label: 'Section 1'
      },
      'section2': {
        label: 'Section 2'
      },
      'users': {
        label: 'Users'
      }
    }
  });

}).call(this);

(function() {

  Klass.models.User = Backbone.Model.extend({
    urlRoot: '/api/users'
  });

}).call(this);

(function() {

  Klass.views.Dashboard = Backbone.View.extend({
    templateName: 'dashboard',
    initialize: function(opts) {
      return this.render();
    }
  });

}).call(this);

(function() {

  Klass.views.Main = Backbone.View.extend({
    templateName: 'main',
    events: {
      'click a': 'navigate'
    },
    initialize: function(opts) {
      this.menu = opts.menu, this.views = opts.views;
      return this.render();
    },
    render: function() {
      Backbone.View.prototype.render.call(this);
      this.views.top = new Klass.views.Menu({
        el: this.$('#menu'),
        model: this.menu
      });
      return this.renderSections();
    },
    renderSections: function() {
      this.views.dashboard = new Klass.views.Dashboard({
        el: this.$('#content')
      });
      this.views.section1 = new Klass.views.Section1({
        el: this.$('#content')
      });
      this.views.section2 = new Klass.views.Section2({
        el: this.$('#content')
      });
      return this.views.users = new Klass.views.Users({
        el: this.$('#content')
      });
    },
    hideAllSections: function() {
      return this.$('#content > .section').hide();
    },
    showSection: function(section, opts) {
      this.menu.set('active', section);
      return this.views[section].show(opts);
    }
  });

}).call(this);

(function() {

  Klass.views.Menu = Backbone.View.extend({
    templateName: 'menu',
    initialize: function(opts) {
      this.render();
      return this.model.on('change:active', this.setActive, this);
    },
    templateHash: function() {
      return {
        menu: this.model.nav
      };
    },
    setActive: function() {
      var active;
      this.$('li.active').removeClass('active');
      active = this.model.get('active');
      return this.$("li[data-section=" + active + "]").addClass('active');
    }
  });

}).call(this);

(function() {

  Klass.views.Section1 = Backbone.View.extend({
    templateName: 'section1',
    initialize: function(opts) {
      return this.render();
    }
  });

}).call(this);

(function() {

  Klass.views.Section2 = Backbone.View.extend({
    templateName: 'section2',
    initialize: function(opts) {
      return this.render();
    }
  });

}).call(this);

(function() {

  Klass.views.UsersViewAll = Backbone.View.extend({
    templateName: 'usersViewAll',
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        users: this.model.toJSON()
      };
    }
  });

}).call(this);

(function() {

  Klass.views.UsersViewOne = Backbone.View.extend({
    templateName: 'usersViewOne',
    initialize: function(opts) {
      var userId,
        _this = this;
      userId = opts.userId;
      this.userId = parseInt(userId, 10);
      return this.model.fetch({
        success: function() {
          var user;
          user = _this.model.get(_this.userId);
          return user.fetch({
            success: function() {
              return _this.render();
            }
          });
        }
      });
    },
    templateHash: function() {
      return this.model.get(this.userId).toJSON();
    }
  });

}).call(this);

(function() {

  Klass.views.Users = Backbone.View.extend({
    templateName: 'users',
    action: null,
    initialize: function(opts) {
      this.render();
      return this.views = {};
    },
    displayAction: function(action, opts) {
      var cls;
      if (this.views[this.action] != null) {
        this.views[this.action].remove();
      }
      this.action = action;
      if (this.action === 'viewOne') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Users" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.collections.Users = Backbone.Collection.extend({
    url: '/api/users',
    model: Klass.models.User,
    fetched: false,
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = true;
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
    }
  });

}).call(this);

(function() {

  App.templates = function(name) {
    return jade.templates[name];
  };

  App.initModels = function() {
    this.models.menu = new Klass.models.Menu({});
    return this.collections.users = new Klass.collections.Users();
  };

  App.init = function() {
    this.initModels();
    this.views.main = new Klass.views.Main({
      el: 'body',
      menu: this.models.menu,
      views: this.views
    });
    this.routers.main = new Klass.routers.Main(this.views, this.models, this.collections);
    return Backbone.history.start({
      pushState: true
    });
  };

  $(function() {
    return App.init();
  });

}).call(this);
