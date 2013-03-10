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
      "domain": "showDomain",
      "dashboard": "showDashboard",
      "pageflows": "showPageflows",
      "pageflows/*category": "showPageflowsDetails",
      "pageviews": "showPageviews",
      "pageviews/*category": "showPageviewsDetails",
      "pagelinks": "showPagelinks",
      "pagelinks/*baseUrl": "showPagelinksDetails",
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
    _navigateToDomain: function() {
      return this.navigate('/domain', {
        trigger: true
      });
    },
    showDomain: function() {
      if (!this.models.domain.has('domain')) {
        this.setTitle('Domain');
        return this.views.main.showDomainForm();
      } else {
        return this.navigate('/dashboard', {
          trigger: true
        });
      }
    },
    showDashboard: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Dashboard');
      return this.views.main.showSection('dashboard');
    },
    showPageflows: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageflows');
      this.views.main.showSection('pageflows');
      return this.views.pageflows.displayAction('viewBasic', {
        model: this.collections.pageflows
      });
    },
    showPageflowsDetails: function(category) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageflows - details');
      this.views.main.showSection('pageflows');
      return this.views.pageflows.displayAction('viewDetails', {
        model: this.collections.pageflows,
        category: category
      });
    },
    showPageviews: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageviews');
      this.views.main.showSection('pageviews');
      return this.views.pageviews.displayAction('viewBasic', {
        model: this.collections.pageviews
      });
    },
    showPageviewsDetails: function(category) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pageviews - details');
      this.views.main.showSection('pageviews');
      return this.views.pageviews.displayAction('viewDetails', {
        model: this.collections.pageviews,
        category: category
      });
    },
    showPagelinks: function() {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pagelinks');
      this.views.main.showSection('pagelinks');
      return this.views.pagelinks.displayAction('viewBasic', {
        model: this.collections.pagelinks
      });
    },
    showPagelinksDetails: function(baseUrl) {
      if (!this.models.domain.has('domain')) {
        return this._navigateToDomain();
      }
      this.setTitle('Pagelinks - details');
      this.views.main.showSection('pagelinks');
      return this.views.pagelinks.displayAction('viewDetails', {
        model: this.collections.pagelinks,
        baseUrl: baseUrl
      });
    }
  });

}).call(this);

(function() {

  Klass.models.Domain = Backbone.Model.extend({
    url: '/api/domain',
    idAttribute: '_id'
  });

}).call(this);

(function() {

  Klass.models.Menu = Backbone.Model.extend({
    nav: {
      'dashboard': {
        label: 'Dashboard'
      },
      'pageflows': {
        label: 'Pageflows'
      },
      'pageviews': {
        label: 'Pageviews'
      },
      'pagelinks': {
        label: 'Pagelinks'
      }
    }
  });

}).call(this);

(function() {

  Klass.models.Pageflow = Backbone.Model.extend({
    urlRoot: '/api/pageflows',
    idAttribute: 'url'
  });

}).call(this);

(function() {

  Klass.models.Pagelink = Backbone.Model.extend({
    urlRoot: '/api/pagelinks/www.restauracja-laura.pl',
    idAttribute: 'url'
  });

}).call(this);

(function() {

  Klass.models.Pageview = Backbone.Model.extend({
    urlRoot: '/api/pageviews',
    idAttribute: 'url'
  });

}).call(this);

(function() {

  Klass.views.Dashboard = Backbone.View.extend({
    templateName: 'dashboard',
    initialize: function(opts) {
      this.render();
      return this.bindSlider();
    },
    bindSlider: function() {
      var _this = this;
      return this.$('.slider').slider({
        range: 'min',
        animate: true,
        value: 0.50,
        min: 0.01,
        max: 0.99,
        step: 0.01,
        slide: function(event, ui) {
          return _this.$('.slider-result .value').html(ui.value);
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.views.Domain = Backbone.View.extend({
    templateName: 'domain',
    events: {
      'submit': 'setDomain'
    },
    initialize: function(opts) {
      return this.render();
    },
    setDomain: function(e) {
      var $input, domain,
        _this = this;
      e.preventDefault();
      $input = this.$('input[type=text]');
      domain = $input.val();
      if (!domain.length) {
        $input.addClass('error').focus();
        return;
      }
      return this.model.save({
        domain: $.trim($input.val())
      }, {
        success: function() {
          $input.val('');
          return _this.navigate('/dashboard');
        }
      });
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
      this.menu = opts.menu, this.domain = opts.domain, this.views = opts.views;
      return this.render();
    },
    render: function() {
      Backbone.View.prototype.render.call(this);
      this.views.top = new Klass.views.Top({
        el: this.$('#top'),
        model: this.menu,
        domain: this.domain
      });
      this.renderSections();
      return this.views.domain = new Klass.views.Domain({
        el: this.$('#domain'),
        model: this.domain
      });
    },
    renderSections: function() {
      this.views.dashboard = new Klass.views.Dashboard({
        el: this.$('#content')
      });
      this.views.pageflows = new Klass.views.Pageflows({
        el: this.$('#content')
      });
      this.views.pageviews = new Klass.views.Pageviews({
        el: this.$('#content')
      });
      return this.views.pagelinks = new Klass.views.Pagelinks({
        el: this.$('#content')
      });
    },
    showSection: function(section, opts) {
      this.views.domain.hide();
      this._hideAllSections();
      this.$('#top').show();
      this.menu.set('active', section);
      return this.views[section].show();
    },
    showDomainForm: function() {
      this._hideAllSections();
      this.$('#top').hide();
      return this.views.domain.show();
    },
    _hideAllSections: function() {
      return this.$('#content > .section').hide();
    }
  });

}).call(this);

(function() {

  Klass.views.PageflowsViewBasic = Backbone.View.extend({
    templateName: 'pageflowsViewBasic',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          return _this.render();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty
      };
    }
  });

}).call(this);

(function() {

  Klass.views.PageflowsViewDetails = Backbone.View.extend({
    templateName: 'pageflowsViewDetails',
    initialize: function(opts) {
      var bounds, category,
        _this = this;
      category = opts.category;
      if (!/^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test(category)) {
        this.navigate('/pageflows');
        return;
      }
      bounds = category.split('-');
      this.bound = {
        lower: bounds[0],
        upper: bounds[1]
      };
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      var pageflowModel, pageflows, pageflowsModels;
      pageflowsModels = this.model.getPageflowsCategory(this.bound.lower, this.bound.upper);
      pageflows = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageflowsModels.length; _i < _len; _i++) {
          pageflowModel = pageflowsModels[_i];
          _results.push(pageflowModel.toJSON());
        }
        return _results;
      })();
      return {
        pageflows: pageflows,
        bounds: "" + this.bound.lower + "-" + this.bound.upper
      };
    }
  });

}).call(this);

(function() {

  Klass.views.Pageflows = Backbone.View.extend({
    templateName: 'pageflows',
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
      if (this.action === 'viewDetails') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pageflows" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.views.PagelinksViewBasic = Backbone.View.extend({
    templateName: 'pagelinksViewBasic',
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.views.PagelinksViewDetails = Backbone.View.extend({
    templateName: 'pagelinksViewDetails',
    initialize: function(opts) {
      var baseUrl;
      baseUrl = opts.baseUrl;
      this.baseUrl = decodeURIComponent(baseUrl);
      return this.model.fetch({
        success: _.bind(this.fetch, this)
      });
    },
    fetch: function() {
      var pagelink,
        _this = this;
      pagelink = this.model.get(this.baseUrl);
      if (!pagelink) {
        this.navigate('/pagelinks');
        return;
      }
      return pagelink.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return this.model.get(this.baseUrl).toJSON();
    }
  });

}).call(this);

(function() {

  Klass.views.Pagelinks = Backbone.View.extend({
    templateName: 'pagelinks',
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
      if (this.action === 'viewDetails') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pagelinks" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.views.PageviewsViewBasic = Backbone.View.extend({
    templateName: 'pageviewsViewBasic',
    isEmpty: false,
    initialize: function(opts) {
      var _this = this;
      return this.model.fetch({
        success: function() {
          _this.isEmpty = false;
          return _this.render();
        },
        error: function() {
          _this.isEmpty = true;
          return _this.render();
        }
      });
    },
    templateHash: function() {
      return {
        isEmpty: this.isEmpty
      };
    }
  });

}).call(this);

(function() {

  Klass.views.PageviewsViewDetails = Backbone.View.extend({
    templateName: 'pageviewsViewDetails',
    initialize: function(opts) {
      var bounds, category,
        _this = this;
      category = opts.category;
      if (!/^(1|6|11|51|101|501|1001)-(5|10|50|100|500|1000|oo)$/.test(category)) {
        this.navigate('/pageviews');
        return;
      }
      bounds = category.split('-');
      this.bound = {
        lower: bounds[0],
        upper: bounds[1]
      };
      return this.model.fetch({
        success: function() {
          return _this.render();
        }
      });
    },
    templateHash: function() {
      var pageviewModel, pageviews, pageviewsModels;
      pageviewsModels = this.model.getPageviewsCategory(this.bound.lower, this.bound.upper);
      pageviews = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = pageviewsModels.length; _i < _len; _i++) {
          pageviewModel = pageviewsModels[_i];
          _results.push(pageviewModel.toJSON());
        }
        return _results;
      })();
      return {
        pageviews: pageviews,
        bounds: "" + this.bound.lower + "-" + this.bound.upper
      };
    }
  });

}).call(this);

(function() {

  Klass.views.Pageviews = Backbone.View.extend({
    templateName: 'pageviews',
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
      if (this.action === 'viewDetails') {
        this.$('.back').show();
      } else {
        this.$('.back').hide();
      }
      opts = opts || {};
      opts.el = this.$('.tile');
      cls = action.substr(0, 1).toUpperCase() + action.substr(1);
      return this.views[action] = new Klass.views["Pageviews" + cls](opts);
    }
  });

}).call(this);

(function() {

  Klass.views.Top = Backbone.View.extend({
    templateName: 'top',
    events: {
      'click .delete': 'deleteDomain'
    },
    initialize: function(opts) {
      this.domain = opts.domain;
      this.render();
      this.model.on('change:active', this.setActive, this);
      return this.domain.on('change:domain', this.render, this);
    },
    templateHash: function() {
      return {
        menu: this.model.nav,
        domain: this.domain.get('domain')
      };
    },
    setActive: function() {
      var active;
      this.$('li.active').removeClass('active');
      active = this.model.get('active');
      return this.$("li[data-section=" + active + "]").addClass('active');
    },
    deleteDomain: function(e) {
      var _this = this;
      e.preventDefault();
      return this.domain.destroy({
        success: function() {
          _this.domain.clear();
          return _this.navigate('/domain');
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.collections.Pageflows = Backbone.Collection.extend({
    model: Klass.models.Pageflow,
    fetched: null,
    url: function() {
      return "/api/pageflows/" + (this.domain.get('domain'));
    },
    initialize: function(attrs, domain) {
      this.domain = domain;
    },
    comparator: function(pageflow) {
      return pageflow.get('count');
    },
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched === this.domain.get('domain')) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = _this.domain.get('domain');
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
    },
    getPageflowsCategory: function(lowerBound, upperBound) {
      var _this = this;
      return this.filter(function(pageflow) {
        if (upperBound === 'oo') {
          return pageflow.get('count') >= lowerBound;
        } else {
          return pageflow.get('count') >= lowerBound && pageflow.get('count') <= upperBound;
        }
      });
    }
  });

}).call(this);

(function() {

  Klass.collections.Pagelinks = Backbone.Collection.extend({
    url: '/api/pagelinks/www.restauracja-laura.pl',
    model: Klass.models.Pagelink,
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

  Klass.collections.Pageviews = Backbone.Collection.extend({
    model: Klass.models.Pageview,
    fetched: null,
    url: function() {
      return "/api/pageviews/" + (this.domain.get('domain'));
    },
    initialize: function(attrs, domain) {
      this.domain = domain;
    },
    comparator: function(pageview) {
      return pageview.get('count');
    },
    fetch: function(opts) {
      var success,
        _this = this;
      opts = opts || {};
      if (this.fetched === this.domain.get('domain')) {
        if (opts.success != null) {
          return opts.success();
        }
      } else {
        success = opts.success;
        opts.success = function() {
          _this.fetched = _this.domain.get('domain');
          return success();
        };
        return Backbone.Collection.prototype.fetch.call(this, opts);
      }
    },
    getPageviewsCategory: function(lowerBound, upperBound) {
      var _this = this;
      return this.filter(function(pageview) {
        if (upperBound === 'oo') {
          return pageview.get('count') >= lowerBound;
        } else {
          return pageview.get('count') >= lowerBound && pageview.get('count') <= upperBound;
        }
      });
    }
  });

}).call(this);

(function() {

  App.templates = function(name) {
    return jade.templates[name];
  };

  App.initModels = function() {
    this.models.domain = new Klass.models.Domain();
    this.models.menu = new Klass.models.Menu({});
    this.collections.pagelinks = new Klass.collections.Pagelinks();
    this.collections.pageviews = new Klass.collections.Pageviews({}, this.models.domain);
    return this.collections.pageflows = new Klass.collections.Pageflows({}, this.models.domain);
  };

  App.init = function() {
    var _this = this;
    this.initModels();
    return this.models.domain.fetch().always(function() {
      _this.views.main = new Klass.views.Main({
        el: 'body',
        menu: _this.models.menu,
        domain: _this.models.domain,
        views: _this.views
      });
      _this.routers.main = new Klass.routers.Main(_this.views, _this.models, _this.collections);
      return Backbone.history.start({
        pushState: true
      });
    });
  };

  $(function() {
    return App.init();
  });

}).call(this);
