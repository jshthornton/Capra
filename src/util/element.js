define([
	'underscore',
	'jquery'
], function(_, $) {
	'use strict';
	return {
		isAttached: function(element) {
			if(_.isElement(element) === false) {
				throw new Error('Not an element');
			}

			if(element.parentElement === null) {
				return false;
			}

			return $.contains(document.documentElement, element);
		},

		serializeAttributes: function(data, options) {
			var attributes = [];

			options = _.extend({
				join: true
			}, options || {});

			_.forOwn(data, function(value, key) {
				var attribute = this.serializeAttribute(key, value);
				if(attribute != null) {
					attributes.push(attribute);
				}
			}, this);

			if(options.join === true) {
				return attributes.join(' ');
			}

			return attributes;
		},

		serializeAttribute: function(key, value) {
			var parsedKey,
				parsedValue;

			switch(key) {
				// Where key = value
				case 'tagName':
					parsedKey = value;
					break;
				// Where bools can be used
				// Where no value, but key is used
				case 'disabled':
				case 'checked':
					if(value === true || value === key) {
						parsedKey = key;
					}
					break;
				case 'className':
					parsedKey = 'class';

					if(_.isArray(value)) {
						parsedValue = value.join(' ');
					} else if(_.isString(value)) {
						parsedValue = value;
					}
					break;
				default:
					parsedKey = key;
					parsedValue = value;
					break;
			}

			if(parsedKey != null) {
				if(parsedValue != null) {
					return parsedKey + '=' + '"' + parsedValue + '"';
				}

				return parsedKey;
			}

			return undefined;
		},

		openTag: function(data) {
			var el = '<';
			el += this.serializeAttributes(data);
			el += '>';

			return el;
		}
	};
});