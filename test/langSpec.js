define([
	'capra/lang'
], function(lang) {
	describe('capra/lang', function() {
		it('return undefined on undefined', function() {
			expect(lang.getObject(undefined, 'test')).toEqual(undefined);
		});

		it('return undefined on null', function() {
			expect(lang.getObject(null, 'test')).toEqual(undefined);
		});

		it('return undefined on array', function() {
			expect(lang.getObject([], 'test')).toEqual(undefined);
		});

		it('return undefined on number', function() {
			expect(lang.getObject(1, 'test')).toEqual(undefined);
		});

		it('return undefined on string', function() {
			expect(lang.getObject('boo', 'test')).toEqual(undefined);
		});

		it('return undefined on bool', function() {
			expect(lang.getObject(true, 'test')).toEqual(undefined);
		});

		it('return undefined on non-string key', function() {
			expect(lang.getObject({})).toEqual(undefined);
		});

		it('Should support top level', function() {
			expect(lang.getObject({
				test: 1
			}, 'test')).toEqual(1);
		});

		it('Should support nested', function() {
			expect(lang.getObject({
				deeper: {
					test: 1
				}
			}, 'deeper.test')).toEqual(1);
		});

		it('Should support indexes', function() {
			expect(lang.getObject({
				deeper: [1]
			}, 'deeper.0')).toEqual(1);
		});

		it('Should return undefined for nested', function() {
			expect(lang.getObject({
			}, 'deeper.test')).toEqual(undefined);
		});

		it('Should return undefined for nested (that has value)', function() {
			expect(lang.getObject({
				deeper: {}
			}, 'deeper.test')).toEqual(undefined);
		});
	});
});