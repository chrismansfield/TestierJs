import Builder from './builder';

/**
 * Used to create proper test scenarios for the Builder class
 * @private
 */
class TestBuilder extends Builder {

	defineProperty(name, value) {
		this[name] = value;
	}
}

describe('Builder.with', function () {

	describe('with()', function () {

		it('should set values of properties with matching names', function () {
			const sut = new TestBuilder();
			sut.defineProperty('firstProperty', 'initial first');
			sut.defineProperty('secondProperty', 'initial second');

			sut.with({
				firstProperty: 'new first',
				secondProperty: 'new second'
			});

			expect(sut).toEqual(expect.objectContaining({
				firstProperty: 'new first',
				secondProperty: 'new second'
			}));
		});

		it('should not set properties not already defined', function () {
			const sut = new TestBuilder();

			sut.with({
				nonDefinedProperty: 'this should not be set'
			});

			expect(sut.nonDefinedProperty).toBeUndefined();
		});

		it('should set values of properties with names matching using an underscore prefix', function () {
			const sut = new TestBuilder();
			sut.defineProperty('_firstProperty', 'initial first');
			sut.defineProperty('_secondProperty', 'initial second');

			sut.with({
				firstProperty: 'new first',
				secondProperty: 'new second'
			});

			expect(sut).toEqual(expect.objectContaining({
				_firstProperty: 'new first',
				_secondProperty: 'new second'
			}));
		});

		it('should return itself for chaining', function () {
			const sut = new TestBuilder();

			const actual = sut.with({});

			expect(actual).toBe(sut);
		});
	});

	describe('build()', function () {

		it('should return an object with properties matching the builders properties', function () {
			const sut = new TestBuilder();
			sut.defineProperty('firstProperty', 'first value');
			sut.defineProperty('secondProperty', 'second value');

			const actual = sut.build();

			expect(actual).toEqual({
				firstProperty: 'first value',
				secondProperty: 'second value'
			});
		});

		it('should return an object with properties matchin the builders properties without prefixing underscores', function () {
			const sut = new TestBuilder();
			sut.defineProperty('_firstProperty', 'first value');
			sut.defineProperty('_secondProperty', 'second value');

			const actual = sut.build();

			expect(actual).toEqual({
				firstProperty: 'first value',
				secondProperty: 'second value'
			});
		});

		it('should return an object with properties matchin the builders properties with any non-prefix underscores', function () {
			const sut = new TestBuilder();
			sut.defineProperty('_first_property', 'first value');
			sut.defineProperty('_second_property', 'second value');

			const actual = sut.build();

			expect(actual).toEqual({
				first_property: 'first value',
				second_property: 'second value'
			});
		});

	});

});
