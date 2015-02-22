define([
	'capra/util/element'
], function(elementUtil) {
	describe('capra/util/element', function() {
		it('Should not accept a non-element', function() {
			expect(function() {
				elementUtil.isAttached(null);
			}).toThrow(new Error('Not an element'));
		});

		it('Should not accept a document element', function() {
			expect(function() {
				elementUtil.isAttached(document);
			}).toThrow(new Error('Not an element'));
		});
	});
});