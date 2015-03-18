define([
	'capra/util/element'
], function(elementUtil) {
	describe('capra/util/element', function() {
		describe('.isAttached', function() {
			it('Should not accept a non-element', function() {
				expect(function() {
					elementUtil.isAttached(null);
				}).toThrow(new Error('Not an element'));
			});

			it('Should not accept a document element', function() {
				expect(function() {
					elementUtil.isAttached(document);
				}).toThrow(new Error('Not an element'));
			});
		});

		describe('.serializeAttribute', function() {
			it('Should create key="value" for unknown', function() {
				expect(elementUtil.serializeAttribute('hello', 'world!')).toEqual('hello="world!"');
			});

			it('Should use value for key', function() {
				expect(elementUtil.serializeAttribute('tagName', 'div')).toEqual('div');
			});

			it('Should join class list', function() {
				expect(elementUtil.serializeAttribute('className', ['foo', 'bar'])).toEqual('class="foo bar"');
			});

			it('Should not join class list', function() {
				expect(elementUtil.serializeAttribute('className', 'foo bar')).toEqual('class="foo bar"');
			});

			it('Should disable (bool)', function() {
				expect(elementUtil.serializeAttribute('disabled', true)).toEqual('disabled');
			});

			it('Should disable (string)', function() {
				expect(elementUtil.serializeAttribute('disabled', 'disabled')).toEqual('disabled');
			});

			it('Should not disable (bool)', function() {
				expect(elementUtil.serializeAttribute('disabled', false)).toEqual(undefined);
			});

			it('Should not disable (wrong string)', function() {
				expect(elementUtil.serializeAttribute('disabled', 'foo')).toEqual(undefined);
			});
		});

		describe('.serializeAttributes', function() {
			it('Should skip undefined attributes', function() {
				expect(elementUtil.serializeAttributes({
					'tagName': 'div',
					'disabled': false
				})).toEqual('div');

				expect(elementUtil.serializeAttributes({
					'disabled': false
				})).toEqual('');
			});

			it('Should add spacing', function() {
				expect(elementUtil.serializeAttributes({
					'tagName': 'div',
					'disabled': true
				})).toEqual('div disabled');
			});
		});

		describe('.openTag', function() {
			it('Should wrap in <>', function() {
				expect(elementUtil.openTag({
					'tagName': 'div',
					'disabled': true
				})).toEqual('<div disabled>');
			});
		});
	});
});