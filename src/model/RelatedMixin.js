define([
	'ring',
	'underscore'
], function(ring, _) {
	return ring.create({

		fetchTree: function(options) {
			var store = this.collection.store;

			if(_.has(options, 'contains') && _.isObject(options.contains)) {
				// A Leaf
				return this.fetch(options);
			} else {
				// A branch and a leaf
				return this.fetch(options).then(function() {
					_.forOwn(options.contains, function(relatedOptions, key) {
						var relatedModel = store.getRelated(this, key);

						if(relatedOptions === true) {
							relatedOptions = undefined;
						}

						return relatedModel.fetchTree(relatedOptions);
					}, this);
				});
			}
		}
	});
});