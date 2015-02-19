define([
	'underscore',
	'capra/Store',
	'backbone'
], function(_, Store, Backbone) {
	describe('capra/Store', function() {
		beforeEach(function() {
			this.evt = _.extend({}, Backbone.Events);
			this.store = new Store();
		});

		it('Should create an instance', function() {
			expect(this.store instanceof Store).toEqual(true);
		});

		it('Should register a collection', function() {
			var collection = new Backbone.Collection();
			this.store.register('collection', collection);

			expect(this.store.collections.collection).toEqual(collection);
		});

		it('Should not register a non-collection', function() {
			var obj = {};
			this.store.register('collection', obj);

			expect(_.size(this.store.collections)).toEqual(0);
		});

		describe('Get related', function() {
			describe('hasOne', function() {
				beforeEach(function() {
					var User = this.User = Backbone.Model.extend({
						relationships: [
							{
								key: 'profile',
								type: 'hasOne',
								collection: 'profiles',
								foreignKey: 'user'
							}
						]
					});

					var Profile = this.Profile = Backbone.Model.extend({
						relationships: [
							{
								key: 'user',
								type: 'hasOne',
								collection: 'users',
								foreignKey: 'profile'
							}
						]
					});

					var users = this.users = new Backbone.Collection(),
						profiles = this.profiles = new Backbone.Collection();

					users.model = User;
					profiles.model = Profile;

					this.store.register('users', users);
					this.store.register('profiles', profiles);

					var user = new this.User();
					var profile = new this.Profile({
						user: user.cid
					});

					this.users.reset(user);
					this.profiles.reset(profile);
				});

				describe('id', function() {
					beforeEach(function() {
						this.users.add({
							id: 1
						});

						this.profiles.add({
							id: 1,
							user: 1
						});
					});

					it('Should get from self', function() {
						var user = this.store.getRelated(this.profiles.get(1), 'user');
						expect(user instanceof this.User).toEqual(true);
					});

					it('Should get from other', function() {
						var user = this.users.get(1);
						var profile = this.store.getRelated(user, 'profile');
						expect(profile instanceof this.Profile).toEqual(true);
					});
				});

				describe('cid', function() {
					var user, profile;

					beforeEach(function() {
						user = new this.User();
						profile = new this.Profile({
							user: user.cid
						});

						this.users.reset(user);
						this.profiles.reset(profile);
					});

					it('Should get from self', function() {
						var _user = this.store.getRelated(profile, 'user');
						expect(_user).toEqual(user);
					});

					it('Should get from other', function() {
						var _profile = this.store.getRelated(user, 'profile');
						expect(_profile).toEqual(profile);
					});

					it('Should update id', function() {
						expect(profile.get('user')).toEqual(user.cid);
						user.set('id', 1);
						expect(profile.get('user')).toEqual(user.id);
					});
				});
			});

			describe('hasMany', function() {
				beforeEach(function() {
					var User = this.User = Backbone.Model.extend({
						relationships: [
							{
								key: 'profiles',
								type: 'hasMany',
								collection: 'profiles',
								foreignKey: 'user'
							}
						]
					});

					var Profile = this.Profile = Backbone.Model.extend({
						relationships: [
							{
								key: 'user',
								type: 'hasOne',
								collection: 'users',
								foreignKey: 'profiles'
							}
						]
					});

					var users = this.users = new Backbone.Collection(),
						profiles = this.profiles = new Backbone.Collection();

					users.model = User;
					profiles.model = Profile;

					this.store.register('users', users);
					this.store.register('profiles', profiles);
				});


				describe('id', function() {
					beforeEach(function() {
						this.users.add({
							id: 1
						});

						this.profiles.add({
							id: 1,
							user: 1
						});
					});

					it('Should get from self', function() {
						var user = this.store.getRelated(this.profiles.get(1), 'user');
						expect(user instanceof this.User).toEqual(true);
					});

					it('Should get from other', function() {
						var user = this.users.get(1);
						var profiles = this.store.getRelated(user, 'profiles');
						expect(profiles.length).toEqual(1);
					});
				});

				describe('cid', function() {
					var user, profile;

					beforeEach(function() {
						user = new this.User();
						profile = new this.Profile({
							user: user.cid
						});

						this.users.reset(user);
						this.profiles.reset(profile);
					});

					it('Should get from self', function() {
						var _user = this.store.getRelated(profile, 'user');
						expect(_user).toEqual(user);
					});

					it('Should get from other', function() {
						var _profiles = this.store.getRelated(user, 'profiles');
						expect(_profiles.length).toEqual(1);
					});

					it('Should update id', function() {
						expect(profile.get('user')).toEqual(user.cid);
						user.set('id', 1);
						expect(profile.get('user')).toEqual(user.id);
					});
				});
			});
		});

		afterEach(function() {
			this.evt.stopListening();
		});
	});
});