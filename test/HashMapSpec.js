define([
	'capra/HashMap',
	'backbone'
], function(HashMap, Backbone) {
	describe('capra/HashMap', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
			this.stateful = new HashMap();
		});

		it('Should create an instance', function() {
			expect(this.stateful instanceof HashMap).toEqual(true);
		});

		it('Should set / get', function() {
			this.stateful.set('test', true);

			expect(this.stateful.get('test')).toEqual(true);
		});

		it('Should set previous', function() {
			this.stateful.set('test', true);
			this.stateful.set('test', false);

			expect(this.stateful.get('test')).toEqual(false);
			expect(this.stateful.previous('test')).toEqual(true);
		});

		it('Should support hash set', function() {
			this.stateful.set({
				test: true
			});

			expect(this.stateful.get('test')).toEqual(true);
		});

		it('Should set / get (custom)', function() {
			this.stateful._testSetter = function(key, value, options) {
				this._set(key, 'goat', options);
			};

			this.stateful._testGetter = function(key, options) {
				return this._get(key, options);
			};

			this.stateful.set('test', true);

			expect(this.stateful.get('test')).toEqual('goat');
		});

		it('Should not fire change (empty)', function() {
			this.stateful.set({});

			expect(this.stateful._fireChange).toEqual(false);
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});