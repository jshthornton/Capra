define([
	'capra/Store',
	'capra/collections/Collection',
	'capra/models/Model',
	'capra/models/RelatedMixin',
	'ring'
], function(Store, Collection, Model, RelatedMixin, ring) {
	describe('capra/models/RelatedMixin', function() {
		var FauxModel;

		beforeAll(function() {
			FauxModel = ring.create([RelatedMixin, Model], {});
		});

		beforeEach(function() {
			this.store = new Store();
		});

		describe('fetchTree', function() {
			var user, profile, gender, users, profiles, genders;

			beforeEach(function() {
				jasmine.Ajax.install();

				var User = ring.create([FauxModel], {
					relationships: [
						{
							key: 'profile',
							type: 'hasOne',
							collection: 'profiles',
							foreignKey: 'user'
						}
					]
				});

				var Profile = ring.create([FauxModel], {
					relationships: [
						{
							key: 'user',
							type: 'hasOne',
							collection: 'users',
							foreignKey: 'profile'
						},
						{
							key: 'gender',
							type: 'hasOne',
							collection: 'genders',
							foreignKey: 'profiles'
						}
					]
				});

				var Gender = ring.create([FauxModel], {
					relationships: [
						{
							key: 'profiles',
							type: 'hasMany',
							collection: 'profiles',
							foreignKey: 'gender'
						}
					]
				});

				user = new User();
				profile = new Profile();
				gender = new Gender();

				users = new Collection();
				profiles = new Collection();
				genders = new Collection();

				users.model = User;
				profiles.model = Profile;
				genders.model = Gender;

				users.url = '/users';
				profiles.url = '/profiles';
				genders.url = '/genders';

				this.store.register('users', users);
				this.store.register('profiles', profiles);
				this.store.register('genders', genders);
				
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
					contains: ['profile']
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
					contains: ['profile']
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

			it('Should return a promise (branch) (hasOne -> hasMany)', function() {
				jasmine.Ajax.stubRequest('/profiles/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "gender": 1 }'
				});

				jasmine.Ajax.stubRequest('/genders/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				profile.set('id', 1);

				var promise = profile.fetchTree({
					contains: ['gender']
				});

				expect(jasmine.Ajax.requests.count()).toEqual(2);
				expect(jasmine.Ajax.requests.first().url).toEqual('/profiles/1');
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('/genders/1');

				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();

				var _gender = this.store.getRelated(profile, 'gender');
				expect(_gender).toBeTruthy();
				expect(_gender.id).toEqual(1);
				expect(this.store.getRelated(_gender, 'profiles').length).toEqual(1);
			});

			it('Should resolve after response (leaf)', function() {
				var promise = user.fetchTree();

				expect(jasmine.Ajax.requests.count()).toEqual(1);
				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();
				
				expect(promise.state()).toEqual('pending');

				jasmine.Ajax.requests.mostRecent().respondWith({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "profile": 1 }'
				});

				expect(promise.state()).toEqual('resolved');
			});

			it('Should resolve after response (branch)', function() {
				var promise = user.fetchTree({
					contains: ['profile']
				});

				expect(jasmine.Ajax.requests.count()).toEqual(1);
				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();
				
				expect(promise.state()).toEqual('pending');

				jasmine.Ajax.requests.first().respondWith({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "profile": 1 }'
				});

				expect(promise.state()).toEqual('pending');

				jasmine.Ajax.requests.mostRecent().respondWith({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				expect(promise.state()).toEqual('resolved');
			});

			it('Should support nested branching', function() {
				jasmine.Ajax.stubRequest('/users/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "profile": 1 }'
				});

				jasmine.Ajax.stubRequest('/profiles/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "gender": 1 }'
				});

				jasmine.Ajax.stubRequest('/genders/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				user.set('id', 1);

				var promise = user.fetchTree({
					contains: [
						{
							key: 'profile',
							options: {
								contains: ['gender']
							}
						}
					]
				});
				
				expect(jasmine.Ajax.requests.count()).toEqual(3);
				expect(jasmine.Ajax.requests.first().url).toEqual('/users/1');
				expect(jasmine.Ajax.requests.at(1).url).toEqual('/profiles/1');
				expect(jasmine.Ajax.requests.mostRecent().url).toEqual('/genders/1');
			});

			it('Should cache double requests', function() {
				jasmine.Ajax.stubRequest('/users/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "profile": 1, "special_profile": 2 }'
				});

				jasmine.Ajax.stubRequest('/profiles/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1, "gender": 1 }'
				});

				jasmine.Ajax.stubRequest('/profiles/2').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 2, "gender": 1 }'
				});

				jasmine.Ajax.stubRequest('/genders/1').andReturn({
					'status': 200,
					'contentType': 'application/json',
					'responseText': '{ "id": 1 }'
				});

				user.set('id', 1);

				user.relationships.push({
					key: 'special_profile',
					type: 'hasOne',
					collection: 'profiles',
					foreignKey: 'user'
				});

				var promise = user.fetchTree({
					contains: [
						{
							key: 'profile',
							options: {
								contains: ['gender']
							}
						},
						{
							key: 'special_profile',
							options: {
								contains: ['gender']
							}
						}
					]
				});
				
				var special_profile = this.store.getRelated(user, 'special_profile');
				expect(special_profile).toBeTruthy();
				var gender = this.store.getRelated(special_profile, 'gender');
				expect(gender).toBeTruthy();
				expect(jasmine.Ajax.requests.count()).toEqual(4);
			});
		});

		describe('set (nested)', function() {
			var users, profiles;

			beforeEach(function() {
				var User = ring.create([FauxModel], {
					relationships: [
						{
							key: 'profile',
							type: 'hasOne',
							collection: 'profiles',
							foreignKey: 'user'
						}
					]
				});

				var Profile = ring.create([FauxModel], {
					relationships: [
						{
							key: 'user',
							type: 'hasOne',
							collection: 'users',
							foreignKey: 'profile'
						}
					]
				});

				users = new Collection();
				profiles = new Collection();

				users.model = User;
				profiles.model = Profile;

				this.store.register('users', users);
				this.store.register('profiles', profiles);
			});

			it('Should add nested related models to store', function() {
				expect(profiles.length).toEqual(0);

				var user = users.add({
					foo: 'bar'
				});

				user.set({
					profile: {
						jim: 'bob'
					}
				});

				expect(profiles.length).toEqual(1);
			});

			it('Should remove nested (but keep cid)', function() {
				var user = users.add({
					foo: 'bar'
				});

				user.set({
					profile: {
						jim: 'bob'
					}
				});

				expect(user.get('profile')).toBeTruthy();
				expect(user.get('profile')).toEqual(profiles.models[0].cid);
			});
		});
	});
});