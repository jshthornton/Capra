define([
	'ring',
	'../HashMap'
], function(ring, HashMap) {
	'use strict';
	return ring.create({
		children: null,

		initialize: function(options) {
			this.children = new HashMap();
			this.children.obj = this;

			this.$super(options);
		},

		_bindEvents: function(options) {
			this.$super(options);
			this.listenTo(this.children, 'change', this.onChildChange);
		},

		addChild: function() {
			var name,
				childView;

			if(arguments.length === 1 && _.isObject(arguments[0])) {
				// Auto-naming
				childView = arguments[0];
				name = childView.cid;
			} else {
				name = arguments[0];
				childView = arguments[1];
			}

			if(childView === this) {
				throw new Error('A view can not parent itself');
			}

			this.listenTo(childView.props, 'change:isRemoved', this.onChildIsRemovedChange);

			this.children.set(name, childView);
			return childView;
		},

		// Start Disposal
		remove: function(options) {
			var args = arguments;

			options = _.extend(options || {}, {
				recursive: true
			});

			if(options.recursive === true) {
				_.forOwn(this.children.properties, function(view) {
					view.remove(options);
				});
			}

			this.$super.apply(this, args);
		},
		// End Disposal

		// Object Events
		onChildChange: function(children, options) {
			if(_.result(options, 'preserve') === true) {
				return;
			}
			_.forOwn(children.changedProperties, function(child, name) {
				var previousChild = children.previous(name);
				if(previousChild == null) {
					return;
				}

				if(_.isObject(previousChild)) {
					if(previousChild.props.get('isRemoved') === false) {
						previousChild.remove();
					}
				}
			});
		},

		onChildIsRemovedChange: function(childProps, options) {
			var view = childProps.obj;
			var key = _.findKey(this.children.properties, function(childView) {
				return view === childView;
			});

			if(!_.isUndefined(key)) {
				// Remove this view from the mem bank.
				this.children.unset(key);
			}
		}
	});
});