define([
	'capra/cache'
], function(cache) {
	describe('capra/cache', function() {
		beforeAll(function() {
			localStorage.clear();
			cache.initialize();
		});
		beforeEach(function() {
			localStorage.clear();
		});

		afterEach(function() {
			localStorage.clear();
		});


		it('Should be able to set item', function() {
			cache.set('test', true);

			expect(cache.get('test')).toEqual(true);
		});

		it('Should throw error on getting non-item', function() {
			expect(cache.exists('foo')).toEqual(false);
			expect(function() {
				cache.get('foo');
			}).toThrow();
		});

		describe('Flush', function() {
			it('Should be able to flush', function() {
				expect(localStorage.length).toEqual(0);
				cache.set('test', true);
				expect(localStorage.length).toEqual(1);
				cache.flush();
				expect(localStorage.length).toEqual(0);
			});

			it('Should not flush non-cache items', function() {
				cache.set('test', true);
				localStorage.setItem('foo', 'bar');
				cache.flush();
				expect(localStorage.getItem('foo')).toEqual('bar');
			});
		});

		describe('Length', function() {
			it('Should get number of items', function() {
				expect(cache.length).toEqual(0);
				cache.set('foo', true);
				expect(cache.length).toEqual(1);
			});

			it('Should not include non-cache', function() {
				expect(cache.length).toEqual(0);
				localStorage.setItem('foo', 'bar');
				expect(cache.length).toEqual(0);
				cache.set('foo', true);
				expect(cache.length).toEqual(1);
			});
		});

		it('Should be detect existance', function() {
			cache.set('foo', 'bar');
			expect(cache.exists('foo')).toEqual(true);
			expect(cache.exists('sadface')).toEqual(false);
		});

		describe('Rename', function() {
			it('Should rename', function() {
				cache.set('foo', true);
				expect(cache.get('foo')).toEqual(true);
				cache.rename('foo', 'bar');
				expect(cache.get('bar')).toEqual(true);
				expect(function() {
					cache.get('foo');
				}).toThrow();
			});

			it('Should overwrite other items', function() {
				cache.set('foo', true);
				cache.set('bar', false);
				expect(cache.get('foo')).toEqual(true);
				expect(cache.get('bar')).toEqual(false);
				
				cache.rename('foo', 'bar');
				expect(cache.get('bar')).toEqual(true);
				expect(function() {
					cache.get('foo');
				}).toThrow();
			});
		});

		describe('Expiry', function() {
			beforeEach(function() {
				jasmine.clock().install();
			});

			afterEach(function() {
				jasmine.clock().uninstall();
			});

			it('Should get ttl', function() {
				cache.set('foo', true, {
					expiry: 60
				});

				var ttl = cache.ttl('foo');
				expect(ttl).toBeDefined();
				expect(ttl).toBeGreaterThan(0);
				expect(ttl).toBeLessThan(61);
			});

			it('Should decrease ttl', function() {
				jasmine.clock().mockDate();
				
				cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(30 * 1000);

				var ttl = cache.ttl('foo');
				expect(ttl).toBeDefined();
				expect(ttl).toBeGreaterThan(0);
				expect(ttl).toBeLessThan(31);
			});

			it('Should expire', function() {
				jasmine.clock().mockDate();
				
				cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(70 * 1000);

				var ttl = cache.ttl('foo');
				expect(ttl).toEqual(0);
			});

			it('Should not be able to get expired item', function() {
				jasmine.clock().mockDate();
				
				cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(70 * 1000);

				var ttl = cache.ttl('foo');
				expect(ttl).toEqual(0);
				expect(function() {
					cache.get('foo')
				}).toThrow();
			});
		});
	});
});