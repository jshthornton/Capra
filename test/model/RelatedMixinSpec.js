define([
	'capra/Store',
	'capra/collection/Collection',
	'capra/model/Model',
	'capra/model/RelatedMixin',
	'ring'
], function(Store, Collection, Model, RelatedMixin, ring) {
	describe('capra/model/RelatedMixin', function() {
		var FauxModel;

		beforeAll(function() {
			FauxModel = ring.create([RelatedMixin, Model], {});
		});

		beforeEach(function() {
			this.store = new Store();
		});

		describe('fetchTree', function() {
			var user, profile, users, profiles;

			beforeEach(function() {
				jasmine.Ajax.install();

				user = new FauxModel();
				profile = new FauxModel();
				users = new Collection();
				profiles = new Collection();

				users.model = FauxModel;
				profiles.model = FauxModel;

				users.url = '/users';
				profiles.url = '/profiles';

				user.relationships = [
					{
						key: 'profile',
						type: 'hasOne',
						collection: 'profiles',
						foreignKey: 'user'
					}
				];

				profile.relationships = [
					{
						key: 'user',
						type: 'hasOne',
						collection: 'users',
						foreignKey: 'profile'
					}
				];

				this.store.register('users', users);
				this.store.register('profiles', profiles);
				
				users.add(user);
				profiles.add(profile);
			});

			afterEach(function() {
				jasmine.Ajax.uninstall();
			});

			it('Should return a promise (leaf)', function() {
				var promise = user.fetchTree();

				expect(jasmine.Ajax.requests.count()).toEqual(1);
				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();
			});

			it('Should return a promise (branch) (hasOne - other)', function() {
				jasmine.Ajax.stubRequest('/users/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				jasmine.Ajax.stubRequest('/profiles?user=1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1,  "user": 1 }'
				});

				user.set('id', 1);

				var promise = user.fetchTree({
					contains: {
						profile: null
					}
				});

				expect(jasmine.Ajax.requests.count()).toEqual(2);
				expect(jasmine.Ajax.requests.first().url).toEqual('/users/1');
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('/profiles?user=1');

				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();

				var _profile = this.store.getRelated(user, 'profile');
				expect(_profile).toBeTruthy();
				expect(_profile.id).toEqual(1);
				expect(_profile.get('user')).toEqual(user.id);
			});

			it('Should return a promise (branch) (hasOne - self)', function() {
				jasmine.Ajax.stubRequest('/users/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "profile": 1 }'
				});

				jasmine.Ajax.stubRequest('/profiles/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				user.set('id', 1);

				var promise = user.fetchTree({
					contains: {
						profile: null
					}
				});

				expect(jasmine.Ajax.requests.count()).toEqual(2);
				expect(jasmine.Ajax.requests.first().url).toEqual('/users/1');
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('/profiles/1');

				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();

				var _profile = this.store.getRelated(user, 'profile');
				expect(_profile).toBeTruthy();
				expect(_profile.id).toEqual(1);
			});
		});

	});
});