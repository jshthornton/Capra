define([
	'backbone',
	'underscore',
	'../HashMap',
	'ring',

	'nodeNab'
], function(Backbone, _, HashMap, ring) {
	return ring.create([Backbone.View], {
		_cidPrefix: 'view',
		props: null, // HashMap
		template: null,

		// Init
		initialize: function(options) {
			options = options || {};

			_.bindAll(this);
			this.$super(options);

			this.props = new HashMap();
			this.props.obj = this;

			this._initialState(options);
			this._bindEvents(options);

			this._beforeMixin(options);
			this._mixinOptions(options);

			if(this.props.get('autoRender') === true) {
				this.render();
			}
		},

		_initialState: function(options) {
			this.props.set({
				autoRender: true,
				autoStartup: true,
				isRendered: false,
				isStartedup: false,
				isRemoved: false
			});
		},

		_bindEvents: function() {

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
		remove: function(options) {
			this.$super(options);

			this.props.set('isRemoved', true);
		}

		// DOM Events
	});
});