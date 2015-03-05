define([
	'capra/HashMap',
	'backbone',
	'underscore'
], function(HashMap, Backbone, _) {
	describe('capra/HashMap', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
			this.hashmap = new HashMap();
		});

		it('Should create an instance', function() {
			expect(this.hashmap instanceof HashMap).toEqual(true);
		});

		it('Should set / get', function() {
			this.hashmap.set('test', true);

			expect(this.hashmap.get('test')).toEqual(true);
			expect(this.hashmap.has('test')).toEqual(true);
		});

		it('Should set previous', function() {
			this.hashmap.set('test', true);
			this.hashmap.set('test', false);

			expect(this.hashmap.get('test')).toEqual(false);
			expect(this.hashmap.previous('test')).toEqual(true);
		});

		it('Should support hash set', function() {
			this.hashmap.set({
				test: true
			});

			expect(this.hashmap.get('test')).toEqual(true);
		});

		it('Should set / get (custom)', function() {
			this.hashmap._testSetter = function(key, value, options) {
				this._set(key, 'goat', options);
			};

			this.hashmap._testGetter = function(key, options) {
				return this._get(key, options);
			};

			this.hashmap.set('test', true);

			expect(this.hashmap.get('test')).toEqual('goat');
		});

		it('Should not fire change (empty)', function() {
			this.hashmap.set({});

			expect(this.hashmap.hasChanged()).toEqual(false);
		});

		it('Should unset', function() {
			this.hashmap.set({
				test: true
			});

			expect(this.hashmap.get('test')).toEqual(true);

			this.hashmap.unset('test');

			expect(this.hashmap.get('test')).toEqual(undefined);
		});

		it('Should clear', function() {
			this.hashmap.set({
				foo: 'bar',
				one: 'two'
			});
			expect(_.size(this.hashmap.properties)).toEqual(2);
			this.hashmap.clear();
			expect(_.size(this.hashmap.properties)).toEqual(0);
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});