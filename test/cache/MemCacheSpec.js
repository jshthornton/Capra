define([
	'capra/cache/MemCache'
], function(Cache) {
	describe('capra/cache/MemCache', function() {
		beforeEach(function() {
			this.cache = new Cache();
		});

		it('Should get container (throw bad input)', function() {
			expect(function() {
				this.cache._getContainer();
			}).toThrow();
		});

		it('Should get container (throw not found)', function() {
			expect(function() {
				this.cache._getContainer('123');
			}).toThrow();
		});

		it('Should get container', function() {
			this.cache.set('foo', 'bar');

			expect(this.cache._getContainer('foo')).toBeTruthy();
		});


		it('Should be able to set item', function() {
			this.cache.set('foo', 'bar');

			expect(this.cache.get('foo')).toEqual('bar');
		});

		it('Should throw error on getting non-item', function() {
			expect(this.cache.exists('foo')).toEqual(false);
			expect(function() {
				this.cache.get('foo');
			}).toThrow();
		});

		describe('Flush', function() {
			it('Should be able to flush', function() {
				expect(this.cache.length).toEqual(0);
				this.cache.set('test', true);
				expect(this.cache.length).toEqual(1);
				this.cache.flush();
				expect(this.cache.length).toEqual(0);
			});
		});

		describe('Length', function() {
			it('Should get number of items', function() {
				expect(this.cache.length).toEqual(0);
				this.cache.set('foo', true);
				expect(this.cache.length).toEqual(1);
			});

			it('Should not included expired items', function() {
				jasmine.clock().install();
				jasmine.clock().mockDate();

				expect(this.cache.length).toEqual(0);
				
				this.cache.set('foo', true, {
					expiry: 2
				});

				expect(this.cache.length).toEqual(1);

				jasmine.clock().tick(3 * 1000);

				var ttl = this.cache.ttl('foo');
				expect(ttl).toEqual(0);

				expect(this.cache.length).toEqual(0);

				jasmine.clock().uninstall();
			});
		});

		it('Should be detect existance', function() {
			this.cache.set('foo', 'bar');
			expect(this.cache.exists('foo')).toEqual(true);
			expect(this.cache.exists('sadface')).toEqual(false);
		});

		describe('Rename', function() {
			it('Should rename', function() {
				this.cache.set('foo', true);
				expect(this.cache.get('foo')).toEqual(true);
				this.cache.rename('foo', 'bar');
				expect(this.cache.get('bar')).toEqual(true);
				expect(function() {
					this.cache.get('foo');
				}).toThrow();
			});

			it('Should overwrite other items', function() {
				this.cache.set('foo', true);
				this.cache.set('bar', false);
				expect(this.cache.get('foo')).toEqual(true);
				expect(this.cache.get('bar')).toEqual(false);
				
				this.cache.rename('foo', 'bar');
				expect(this.cache.get('bar')).toEqual(true);
				expect(function() {
					this.cache.get('foo');
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
				this.cache.set('foo', true, {
					expiry: 60
				});

				var ttl = this.cache.ttl('foo');
				expect(ttl).toBeDefined();
				expect(ttl).toBeGreaterThan(0);
				expect(ttl).toBeLessThan(61);
			});

			it('Should decrease ttl', function() {
				jasmine.clock().mockDate();
				
				this.cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(30 * 1000);

				var ttl = this.cache.ttl('foo');
				expect(ttl).toBeDefined();
				expect(ttl).toBeGreaterThan(0);
				expect(ttl).toBeLessThan(31);
			});

			it('Should expire', function() {
				jasmine.clock().mockDate();
				
				this.cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(70 * 1000);

				var ttl = this.cache.ttl('foo');
				expect(ttl).toEqual(0);
			});

			it('Should not be able to get expired item', function() {
				jasmine.clock().mockDate();
				
				this.cache.set('foo', true, {
					expiry: 60
				});

				jasmine.clock().tick(70 * 1000);

				var ttl = this.cache.ttl('foo');
				expect(ttl).toEqual(0);
				expect(function() {
					this.cache.get('foo');
				}).toThrow();
			});

			it('Should flush expired items', function() {
				jasmine.clock().mockDate();
				
				this.cache.set('foo', true, {
					expiry: 5
				});

				jasmine.clock().tick(6 * 1000);

				var ttl = this.cache.ttl('foo');
				expect(ttl).toEqual(0);

				this.cache.flushExpired();

				expect(function() {
					this.cache.ttl('foo');
				}).toThrow();

			});
		});
	});
});