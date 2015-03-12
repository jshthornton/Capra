define([
	'capra/view/LayoutView'
], function(LayoutView) {
	describe('capra/view/LayoutView', function() {
		it('Should create an instance', function() {
			var view = new LayoutView();

			expect(view instanceof LayoutView).toEqual(true);
		});
	});
});