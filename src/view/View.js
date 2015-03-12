define([
	'backbone',
	'underscore',
	'../HashMap',
	'ring',
	'jquery',

	'nodeNab'
], function(Backbone, _, HashMap, ring, $) {
	'use strict';

	var delegateTriggerSplitter = /^(\S+)\s*(.*)$/;
	var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

	return ring.create([Backbone.View], {
		_cidPrefix: 'view',
		props: null, // HashMap
		template: null,

		constructor: function(options) {
			options || (options = {});
			this.cid = options.cid || _.uniqueId('view');
			_.extend(this, _.pick(options, viewOptions));
			this._ensureElement();
			this.initialize.apply(this, arguments);
			this.delegateTriggers();
			this.delegateEvents();
		},

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

			if(this.props.get('autoStartup') === true) {
				this.startup();
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
			if(_.isObject(options.props)) {
				this.props.set(options.props);
			}

			this.options = options;
		},

		setElement: function(element, delegate) {
			if(this.$el instanceof $) {
				this.$el.removeAttr('data-view-cid');
			}

			if(this.$el) {
				this.undelegateTriggers();
			}

			this.$super.apply(this, arguments);

			if (delegate !== false) {
				this.delegateTriggers();
			}

			this.$el.attr({
				'data-view-cid': this.cid
			});

			return this;
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
			return this;
		},

		// DOM Events
		triggers: {},

		delegateTriggers: function(triggers) {
			if (!(triggers || (triggers = _.result(this, 'triggers')))) {
				return this;
			}

			this.undelegateTriggers();
			for (var key in triggers) {
				var triggerName = triggers[key];
				if (!_.isString(triggerName)){
					continue;
				}

				var match = key.match(delegateTriggerSplitter);
				var eventName = match[1], selector = match[2];

				var method = _.bind(function() {
					this.trigger.apply(this, [triggerName].concat(arguments));
				}, this);

				eventName += '.delegateTriggers' + this.cid;
				if (selector === '') {
					this.$el.on(eventName, method);
				} else {
					this.$el.on(eventName, selector, method);
				}
			}
			return this;
		},

		undelegateTriggers: function() {
			this.$el.off('.delegateTriggers' + this.cid);
			return this;
		}
	});
});