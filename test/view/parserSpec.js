define([
	'capra/view/parser',
	'text!test/fixtures/parser.jst',
	'jquery',

	'capra/view/View'
], function(parser, template, $) {
	describe('capra/view/Parser', function() {
		beforeAll(function() {
			this.$template = $(template);
		});

		it('Should not find any view on an empty element', function() {
			var views = parser.parse({
				$nodes: this.$template.find('#empty')
			});

			expect(views.length).toEqual(0);
		});

		it('Should not find any view on an child element', function() {
			var views = parser.parse({
				$nodes: this.$template.find('#child')
			});

			expect(views.length).toEqual(0);
		});

		it('Should skip children', function() {
			var views = parser.parse({
				$nodes: this.$template.find('#child-view'),
				descendants: false
			});

			expect(views.length).toEqual(0);
		});

		it('Should skip already parsed', function() {
			var views = parser.parse({
				$nodes: this.$template.find('#parsed')
			});

			expect(views.length).toEqual(0);
		});

		it('Should find a view on an empty element', function() {
			var $template = this.$template.find('#empty-view');
			var views = parser.parse({
				$nodes: $template
			});

			expect(views.length).toEqual(1);
		});

		it('Should not find a view on top level', function() {
			var $template = this.$template.find('#empty-view');
			var views = parser.parse({
				$nodes: $template,
				topLevel: false
			});

			expect(views.length).toEqual(0);
		});

		it('Should find child view', function() {
			var views = parser.parse({
				$nodes: this.$template.find('#child-view')
			});

			expect(views.length).toEqual(1);
		});
	});
});