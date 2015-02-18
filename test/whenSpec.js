define(['jquery', 'capra/when'], function($, when) {
	describe('capra/when', function() {
		it('Should return promise', function() {
			var def = new $.Deferred(),
				promise = def.promise();

			var rtn = when(promise);
			expect(rtn.state).toBeDefined();
		});

		it('Should resolve (single)', function(done) {
			var def = new $.Deferred(),
				promise = def.promise();

			var rtn = when(promise).always(function() {
				expect(rtn.state()).toEqual('resolved');
				done();
			});

			def.resolve();
		});

		it('Should reject (single)', function(done) {
			var def = new $.Deferred(),
				promise = def.promise();

			var rtn = when(promise).always(function() {
				expect(rtn.state()).toEqual('rejected');
				done();
			});

			def.reject();
		});

		it('Should resolve (multiple)', function(done) {
			var defs = [
				new $.Deferred(),
				new $.Deferred()
			];

			var rtn = when.apply(null, defs).always(function() {
				expect(rtn.state()).toEqual('resolved');
				done();
			});

			for(var i = 0; i < defs.length; i++) {
				defs[i].resolve();
			}
		});

		it('Should reject (multiple)', function(done) {
			var defs = [
				new $.Deferred(),
				new $.Deferred()
			];

			var rtn = when.apply(null, defs).always(function() {
				expect(rtn.state()).toEqual('rejected');
				done();
			});

			for(var i = 0; i < defs.length; i++) {
				defs[i].reject();
			}
		});

		it('Should wrap single', function(done) {
			var def = new $.Deferred(),
				promise = def.promise();

			var rtn = when(promise).always(function(results) {
				expect(results[0]).toEqual(true);
				done();
			});

			def.resolve(true);
		});
	});
});