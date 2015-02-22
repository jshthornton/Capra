define([
	'ring',
	'../HashMap'
], function(ring, HashMap) {
	return ring.create({
		children: null,

		initialize: function(options) {
			this.children = new HashMap();

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

			this.listenTo(childView, 'remove', this.onChildRemove);

			this.children.set(name, childView);
			return childView;
		},
		removeChild: function(name) {
			if(this.children.has(name) === false) {
				throw new Error('No child view found ' + name);
			}

			this.children.get(name).remove();
			this.children.unset(name);
			return true;
		},

		// Start Disposal
		stopListening: function(options) {
			var args = arguments;

			_.forOwn(this.children.properties, function(view) {
				view.stopListening.apply(view, args);
			});

			this.$super.apply(this, args);
		},

		remove: function() {
			var args = arguments;

			_.forOwn(this.children.properties, function(view) {
				view.remove.apply(view, args);
			});

			this.$super.apply(this, args);
			this.children.clear();

			this.states.set('isRemoved', true);
			this.trigger('remove', this);
		},
		// End Disposal

		// Object Events
		onChildChange: function(children, options) {
			if(_.has(options, 'preserve') === true) {
				return;
			}
			/*_.each(children.changedAttributes(), function(child, name) {
				var previousChild = children.previous(name);
				if(previousChild == null) {
					return;
				}

				if(_.isObject(previousChild)) {
					if(previousChild.states.get('isRemoved') === false) {
						previousChild.remove();
					}
				}
			});*/
		},

		onChildRemove: function(view) {
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