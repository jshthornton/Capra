define([
	'ring',
	'underscore'
], function(ring, _) {
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
					_.forOwn(options.contains, function(relatedOptions, key) {
						var relatedModel = store.getRelated(this, key);

						if(relatedOptions === null) {
							relatedOptions = undefined;
						}

						if(relatedModel == null) {
							relatedModel = store.spawn(this, key);
						}

						return relatedModel.fetchTree(relatedOptions);
					}, this);
				}, this));
			} else {
				// A Leaf
				return this.fetch(options);
			}
		}
	});
});