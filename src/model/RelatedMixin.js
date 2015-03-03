define([
	'ring',
	'underscore',
	'jquery',
	'../when'
], function(ring, _, $, when) {
	return ring.create({

		fetchTree: function(options) {
			var store;

			try {
				store = this.collection.store;
			} catch(err) {
				throw new Error('Model does not belong to a collection or store');
			}

			options = options || {};


			if(_.has(options, 'contains') && _.isObject(options.contains)) {
				// A branch and a leaf
				return this.fetch(options).then(_.bind(function() {
					var promises = [];
					
					_.forOwn(options.contains, function(relatedOptions, key) {
						var relatedModel = store.getRelated(this, key);

						if(relatedOptions === null) {
							relatedOptions = undefined;
						}

						if(relatedModel == null) {
							relatedModel = store.spawn(this, key);
						}

						if(relatedModel.isNew()) {
							var collection,
								relationship;

							relationship = store.getRelationship(this, key);
							collection = store.getCollection(relationship);

							relatedOptions = _.merge(relatedOptions || {}, {
								params: {}
							});

							relatedOptions.params[relationship.foreignKey] = relatedModel.get(relationship.foreignKey);
						}

						promises.push(relatedModel.fetchTree(relatedOptions));
					}, this);

					return when.apply(when, promises);
				}, this));
			} else {
				// A Leaf
				return this.fetch(options);
			}
		}
	});
});