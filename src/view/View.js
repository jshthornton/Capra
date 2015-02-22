define([
	'backbone',
	'underscore',
	'../HashMap',
	'ring',
	'../util/element',

	'nodeNab'
], function(Backbone, _, HashMap, ring, elementUtil) {
	var View = ring.create([Backbone.View], {
		_cidPrefix: 'view',
		props: null, // HashMap
		template: null,

		// Init
		initialize: function(options) {
			options = options || {};

			_.bindAll(this);
			this.$super(options);

			this.props = new Stateful({
				autoRender: elementUtil.isAttached(this.el),
				autoStartup: true,
				isRendered: false,
				isStartedup: false,
				isDisposed: false,
				isRemoved: false
			});
			this.props.obj = this;

			this._beforeMixin();
			this._mixinOptions(options);

			if(this.props.get('autoRender') === true) {
				this.render();
			}
		},

		_beforeMixin: function() {

		},

		_mixinOptions: function(options) {
			if(_.isString(options.cid)) {
				this.cid = options.cid;
			}

			if(_.isObject(options.props)) {
				this.props.set(options.props);
			}

			this.options = options;
		},

		setElement: function() {
			if(this.$el instanceof $) {
				this.$el.removeAttr('data-view-cid');
			}

			this.$super.apply(this, arguments);

			this.$el.attr({
				'data-view-cid': this.cid
			});
		},

		// Render
		templateData: function() {
			return {};
		},

		parseTemplate: function() {
			delete this.$template;

			if(_.isFunction(this.template) === true) {
				var data = this.templateData();
				this.$template = $(this.template(data)).not(function() {
					return this.nodeType === Node.TEXT_NODE;
				});
			} else if(_.isString(this.template) === true) {
				this.$template = $(this.template);
			}
		},

		render: function() {
			this._beforeRender();
			this._render();
			if(this.$template instanceof $) {
				this._bindNodes(this.$template);
			} else {
				this._bindNodes(this.$el);
			}
			this._attach();
			this._afterRender();

			this.props.set('isRendered', true);

			if(this.props.get('autoStartup') === true) {
				this.startup();
			}

			return this;
		},

		_beforeRender: function() {},

		_render: function() {
			this.parseTemplate();
		},

		_bindNodes: function($node) {
			var nodes = {};

			$node.nodeNab({
				dest: nodes
			});

			_.assign(this, nodes);
		},

		_attach: function() {
			if(this.$template instanceof $ && this.$template.length) {
				this.$el.empty();
				this.$el.append(this.$template);
			}
		},

		_afterRender: function() {
		},

		// Startup
		startup: function() {
			this.props.set('isStartedup', true);
		},

		// Teardown
		remove: function() {
			this.$super();

			this.props.set('isRemoved', true);
		},

		stopListening: function() {

		}

		// DOM Events
	});

	View.TRANSITION = {
		PROGRESS_IN: 0,
		IN: 1,
		PROGRESS_OUT: 2,
		OUT: 3
	}

	return View;
});