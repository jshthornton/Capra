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

			it('Should return a promise', function() {
				/*jasmine.Ajax.stubRequest('/another/url').andReturn({
					"responseText": 'immediate response'
				});*/

				var promise = user.fetchTree();

				expect(promise).toBeTruthy();
				expect(promise.state).toBeTruthy();
			});

			//it('Should ');
		});

	});
});