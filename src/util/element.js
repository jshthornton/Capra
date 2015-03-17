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

		openTag: function(options) {
			function toAttr(key, value) {
				var parsedKey,
					parsedValue;

				switch(key) {
					case 'tagName':
						return value;
					case 'className':
						parsedKey = 'class';

						if(_.isArray(value)) {
							parsedValue = value.join(' ');
						}
						break;
					default:
						parsedKey = key;
						parsedValue = value;
						break;
				}

				if(parsedKey !== null && parsedValue !== null) {
					return parsedKey + '=' + '"' + parsedValue + '"';
				} else {
					return undefined;
				}
			};

			options = _.extend({
				tagName: 'div'
			}. options);

			var el = ['<'];
			
			_.forOwn(options, function(value, key) {
				el.push(toAttr(key, value));
			});

			el.push('>');

			return el.join(' ');
		}
	};
});