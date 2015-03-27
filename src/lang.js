define([
	'underscore'
], function(_) {
	'use strict';
	return {
		getObject: function(obj, key) {
			if(_.isString(key) === false) {
				return undefined;
			}

			var sections = key.split('.'),
				result = obj;

			_.each(sections, function(section) {
				if(_.isUndefined(result)) {
					return false;
				}

				result = _.result(result, section);
			});

			return result;
		},

		normalizeStringObject: function(item, key) {
			if(_.isObject(item)) {
				return item;
			}

			var obj = {};
			obj[key] = item;

			return obj;
		}
	};
});