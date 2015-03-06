define([
	'capra/util/array'
], function(arrayUtil) {
	describe('capra/util/array', function() {

		beforeEach(function() {
			this.arr = [0, 1, 2, 3, 4, 5, 6];
		});

		it('Should get next index', function() {
			var index = arrayUtil.next(this.arr, 0, true);
			expect(index).toEqual(1);
		});

		it('Should get prev index', function() {
			var index = arrayUtil.prev(this.arr, 1, true);
			expect(index).toEqual(0);
		});

		it('Should not loop', function() {
			var index;

			// Out of range
			index = arrayUtil.next(this.arr, this.arr.length - 1, false);
			expect(index).toEqual(-1);

			index = arrayUtil.prev(this.arr, 0, false);
			expect(index).toEqual(-1);

			// In range
			index = arrayUtil.next(this.arr, 0, false);
			expect(index).toEqual(1);

			index = arrayUtil.prev(this.arr, 1, false);
			expect(index).toEqual(0);
		});

		it('Should loop', function() {
			var index;

			index = arrayUtil.next(this.arr, this.arr.length - 1, true);
			expect(index).toEqual(0);

			index = arrayUtil.prev(this.arr, 0, true);
			expect(index).toEqual(this.arr.length - 1);
		});

		/*it('Should not accept a document element', function() {
			expect(function() {
				elementUtil.isAttached(document);
			}).toThrow(new Error('Not an element'));
		});*/
	});
});