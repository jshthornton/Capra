define([
	'capra/models/Model',
	'capra/Store',
	'capra/collections/Collection',
	'underscore'
], function(Model, Store, Collection, _) {
	describe('capra/models/Model', function() {
		beforeEach(function() {
			jasmine.Ajax.install();

			this.store = new Store();
			this.collection = new Collection();
			this.collection.url = '/collection';
			this.model = new Model();

			this.store.register('collection', this.collection);
			this.collection.add(this.model);
		});

		afterEach(function() {
			jasmine.Ajax.uninstall();
		});

		it('Should not store request in cache', function() {
			this.model.set('id', 1);

			expect(this.store.requestCache.length).toEqual(0);

			this.model.fetch({
				setCache: false
			});

			expect(this.store.requestCache.length).toEqual(0);
		});

		it('Should store request in cache', function() {
			this.model.set('id', 1);

			expect(this.store.requestCache.length).toEqual(0);

			this.model.fetch();

			expect(this.store.requestCache.length).toEqual(1);
		});

		it('Should only make 1 request', function() {
			this.model.set('id', 1);

			var rtn1 = this.model.fetch();
			var rtn2 = this.model.fetch();

			expect(jasmine.Ajax.requests.count()).toEqual(1);

		});

		it('Should return cached request', function() {
			this.model.set('id', 1);

			var rtn1 = this.model.fetch();
			var rtn2 = this.model.fetch();

			expect(rtn1).toBeTruthy();
			expect(rtn1).not.toEqual(rtn2);

		});

		it('Should call success for cached', function() {
			this.model.set('id', 1);

			var onSuccess1 = jasmine.createSpy('onSuccess1'),
				onSuccess2 = jasmine.createSpy('onSuccess2'),
				onResolved1 = jasmine.createSpy('onResolved1'),
				onResolved2 = jasmine.createSpy('onResolved2');

			var rtn1 = this.model.fetch({
				success: onSuccess1
			}).then(onResolved1);
			var rtn2 = this.model.fetch({
				success: onSuccess2
			}).then(onResolved2);

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'application/json',
				'responseText': '{}'
			});

			expect(onSuccess1).toHaveBeenCalled();
			expect(onSuccess2).toHaveBeenCalled();
			expect(onResolved1).toHaveBeenCalled();
			expect(onResolved2).toHaveBeenCalled();

		});

		it('Should call resolved for cached', function() {
			this.model.set('id', 1);

			var onResolved1 = jasmine.createSpy('onResolved1'),
				onResolved2 = jasmine.createSpy('onResolved2');

			var rtn1 = this.model.fetch().then(onResolved1);
			var rtn2 = this.model.fetch().then(onResolved2);

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'application/json',
				'responseText': '{}'
			});

			expect(onResolved1).toHaveBeenCalled();
			expect(onResolved2).toHaveBeenCalled();
		});

		it('Should call error for cached', function() {
			this.model.set('id', 1);

			var onError1 = jasmine.createSpy('onError1'),
				onError2 = jasmine.createSpy('onError2'); 

			var rtn1 = this.model.fetch({
				error: onError1
			});
			var rtn2 = this.model.fetch({
				error: onError2
			});

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 403,
				'contentType': 'application/json',
				'responseText': '{}'
			});

			expect(onError1).toHaveBeenCalled();
			expect(onError2).toHaveBeenCalled();

		});

		it('Should call reject for cached', function() {
			this.model.set('id', 1);

			var onReject1 = jasmine.createSpy('onReject1'),
				onReject2 = jasmine.createSpy('onReject2');

			var rtn1 = this.model.fetch().then(function() {}, onReject1);
			var rtn2 = this.model.fetch().then(function() {}, onReject2);

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 403,
				'contentType': 'application/json',
				'responseText': '{}'
			});

			expect(onReject1).toHaveBeenCalled();
			expect(onReject2).toHaveBeenCalled();
		});

		it('Should create query string from params', function() {
			this.model.set('id', 1);

			this.model.fetch({
				params: {
					foo: 'bar'
				},
				success: function(model, response, options) {
					expect(options.url).toEqual('/collection/1?foo=bar');
				}
			});

			jasmine.Ajax.requests.mostRecent().respondWith({
				'status': 200,
				'contentType': 'application/json',
				'responseText': '{}'
			});
		});

		it('Should use custom url (even when a default url is not set)', function() {
			var model = new Model();
			expect(function() {
				model.fetch({
					url: 'foo',
					useCache: false
				});
			}).not.toThrow();

			expect(function() {
				model.fetch({
					useCache: false
				});
			}).toThrow();
		});
	});
});