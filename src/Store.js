define([
	'underscore',
	'backbone',
	'ring'
], function(_, Backbone, ring) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// collections: {}

		constructor: function() {
			_.bindAll(this);

			this.collections = {};
		},

		register: function(key, obj) {
			if(obj instanceof Backbone.Collection) {
				obj.store = this;
				this.collections[key] = obj;

				this.listenTo(obj, 'change:id', function(model) {
					this._propogateIdChange(model);
				});

				return;
			}
		},

		_propogateIdChange: function(model) {
			_.each(model.relationships, function(relationship) {
				var related = this.getRelated(model, relationship.key);

				if(_.isArray(related) === false) {
					related = [related];
				}

				_.each(related, function(relatedModel) {
					relatedModel.set(relationship.foreignKey, model.id);
				}, this);
			}, this);
		},

		getRelated: function(model, key) {
			var collection,
				attribute = model.get(key),
				relationship;

			relationship = _.find(model.relationships, function(relationship) {
				return relationship.key === key;
			});

			if(relationship == null) {
				throw new Error('Relationship not found on model');
			}

			collection = this.collections[relationship.collection];

			if(collection == null) {
				throw new Error('Collection ' + relationship.collection + ' not found');
			}

			if(relationship.type === 'hasOne') {
				if(model.has(key)) {
					return collection.get(attribute);
				} else {
					return _.find(collection.models, function(relatedModel) {
						if(relationship.foreignKey == null) {
							throw new Error('Foreign Key not found');
						}

						return model.id === relatedModel.get(relationship.foreignKey) || model.cid === relatedModel.get(relationship.foreignKey);
					});
				}
			}

			if(relationship.type === 'hasMany') {
				return _.filter(collection.models, function(relatedModel) {
					if(relationship.foreignKey == null) {
						throw new Error('Foreign Key not found');
					}
					return model.id === relatedModel.get(relationship.foreignKey) || model.cid === relatedModel.get(relationship.foreignKey);
				});
			}
		}
	}));
});