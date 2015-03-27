define([
	'ring',
	'underscore',
	'jquery',
	'../when',
	'../lang'
], function(ring, _, $, when, lang) {
	'use strict';
	return ring.create({

		getStore: function() {
			return lang.getObject(this, 'collection.store');
		},

		fetchTree: function(options) {
			var store = this.getStore();

			options = options || {};

			if(_.has(options, 'contains') && _.isObject(options.contains)) {
				// A branch and a leaf
				return this.fetch(options).then(_.bind(function() {
					var promises = [];

					_.each(options.contains, function(item) {
						item = lang.normalizeStringObject(item, 'key');

						var relationship = store.findRelationship(this, item.key);

						if(relationship.type === 'hasOne') {
							var relatedModel = store.getRelated(this, item.key);

							if(relatedModel == null) {
								relatedModel = store.spawn(this, item.key);
							}
							if(relatedModel.isNew()) {
								item.options = _.merge(item.options || {}, {
									params: {}
								});

								item.options.params[relationship.foreignKey] = relatedModel.get(relationship.foreignKey);
							}

							promises.push(relatedModel.fetchTree(item.options));

						} else {
							var collection = store.findCollection(relationship);

							var nestedOptions = {
								params: {}
							};
							nestedOptions.params[relationship.foreignKey] = this.id;
							promises.push(collection.fetch(nestedOptions));
						}

					}, this);

					return when.apply(when, promises);
				}, this));
			} else {
				// A Leaf
				return this.fetch(options);
			}
		},

		set: function(key, val, options) {
			var attrs;

			if (key == null) {
				return this;
			}

			// Handle both `"key", value` and `{key: value}` -style arguments.
			if (key == null || typeof key === 'object') {
				attrs = key;
				options = val;
			} else {
				(attrs = {})[key] = val;
			}

			var store = this.getStore(),
				flatAttrs = {};

			_.forOwn(attrs, function(attr, key) {
				if(_.isObject(attr)) {
					// Must be a nested one...
					var relationship = store.findRelationship(this, key);
					if(relationship != null) {
						var collection = store.findCollection(relationship);
						var relatedModel = collection.add(attr, options);
						flatAttrs[key] = relatedModel.id || relatedModel.cid;
						return;
					}
				}

				flatAttrs[key] = attr;
			}, this);

			return this.$super(flatAttrs, options);
		},

		getRelated: function(key) {
			// Just a convenince wrapper
			var store;

			try {
				store = this.collection.store;
			} catch(err) {
				throw new Error('Model does not belong to a collection or store');
			}

			return store.getRelated(this, key);
		}
	});
});