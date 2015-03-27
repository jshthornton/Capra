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

						var relatedModel = store.getRelated(this, item.key);

						if(relatedModel == null) {
							relatedModel = store.spawn(this, item.key);
						}

						if(relatedModel.isNew()) {
							var collection,
								relationship;

							relationship = store.findRelationship(this, item.key);
							collection = store.findCollection(relationship);

							item.options = _.merge(item.options || {}, {
								params: {}
							});

							item.options.params[relationship.foreignKey] = relatedModel.get(relationship.foreignKey);
						}

						promises.push(relatedModel.fetchTree(item.options));
					}, this);

					return when.apply(when, promises);
				}, this));
			} else {
				// A Leaf
				return this.fetch(options);
			}
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