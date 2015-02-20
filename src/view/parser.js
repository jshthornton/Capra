define([
	'jquery',
	'underscore',
	'require'
], function($, _, require) {
	'use strict';
	var parser = {
		parseNode: function($node) {
			if($node.is('[data-view-cid]') === true) {
				//console.info('Skipping parsing of node: %O. Already created.', $node[0]);
				return false; // Already parsed
			}

			if($node.is('[data-view]') === false) {
				return false; // Not a view node
			}

			// Do parse
			var mid = $node.data('view'),
				props = $node.data('viewProps') || {},
				View;

			props.el = $node[0];

			View = require(mid);
			return (new View(props));
		},

		parse: function(options) {
			var _this = this,
				views = [];

			options = _.assign({
				$nodes: $(document.body),
				descendants: true,
				topLevel: true
			}, options);

			options.$nodes.each(function() {
				var $node = $(this);

				if(options.topLevel === true) {
					var view = _this.parseNode($node);
					if(view) {
						views.push(view);
						return; // Do not parse deeper, let that view instance do its own parsing for descendants
					}
				}

				if(options.descendants === true) {
					var $children = $node.children();
					if($children.length === 0) {
						return;
					}

					views = views.concat(_this.parse({
						$nodes: $node.children()
					}));
				}
			});

			return views;
		}
	};

	return parser;
});