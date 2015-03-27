define([
	'underscore',
	'backbone',
	'ring',
	'./caches/MemCache'
], function(_, Backbone, ring, MemCache) {
	'use strict';

	return ring.create(_.extend({}, Backbone.Events, {
		// collections: {}

		constructor: function() {
			_.bindAll(this);

			this.collections = {};
			this.requestCache = new MemCache();
		},

		register: function() {
			var collections;

			if(_.isObject(arguments[0])) {
				collections = arguments[0];
			} else {
				collections = {};
				collections[arguments[0]] = arguments[1];
			}

			_.forOwn(collections, function(collection, key) {
				if(ring.instance(collection, Backbone.Collection) === false) {
					throw new Error('Attempted to register non-collection instance');
				}

				collection.store = this;
				this.collections[key] = collection;

				this.listenTo(collection, 'change:id', function(model) {
					this._propogateIdChange(model);
				});
			}, this);
		},

		_propogateIdChange: function(model) {
			_.each(model.relationships, function(relationship) {
				try {
					var related = this.getRelated(model, relationship.key);

					if(related == null) {
						return;
					}

					if(_.isArray(related) === false) {
						related = [related];
					}

					_.each(related, function(relatedModel) {
						relatedModel.set(relationship.foreignKey, model.id);
					}, this);
				} catch(err) {}
			}, this);
		},

		findRelationship: function(model, key) {
			return _.find(model.relationships, function(relationship) {
				return relationship.key === key;
			});
		},

		findCollection: function(relationship) {
			return this.collections[relationship.collection];
		},

		getRelated: function(model, key) {
			var collection,
				attribute = model.get(key),
				relationship;

			relationship = this.findRelationship(model, key);
			collection = this.findCollection(relationship);
			
			if(relationship.type === 'hasOne') {
				if(model.has(key)) {
					return collection.get(attribute);
				} else {
					return _.find(collection.models, function(relatedModel) {
						if(relationship.foreignKey == null) {
							return;
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
		},

		spawn: function(model, key) {
			var collection,
				attribute = model.get(key),
				relationship;

			relationship = this.findRelationship(model, key);
			if(relationship == null) {
				throw new Error('Could not find relationship ' + key);
			}
			collection = this.findCollection(relationship);
			if(collection == null) {
				throw new Error('Could not find collection ' + relationship);
			}

			var relatedModel = collection.add({});

			if(relationship.type === 'hasOne') {
				if(model.has(key)) {
					relatedModel.set(relatedModel.idAttribute, attribute);
				} else {
					relatedModel.set(relationship.foreignKey, model.id || model.cid);
				}
			}

			if(relationship.type === 'hasMany') {
				relatedModel.set(relationship.foreignKey, model.id || model.cid);
			}

			return relatedModel;
		}
	}));
});