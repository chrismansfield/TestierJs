import sut from './forAll';

describe('forAll', function () {

	[undefined, null, []].forEach(value => {
		it(`should not call the inner function for value ${value && "[]"}`, function () {
			const innerFunction = jest.fn();

			sut(value, innerFunction);

			expect(innerFunction).not.toHaveBeenCalled();
		});
	});

	it('should call the inner function once for each value', function () {
		const values = [1, 2, 3, 'a', 'b', 'c'];
		const invocations = [];

		sut(values, value => { invocations.push(value); });

		expect(invocations).toEqual(values);
	});

	it('should not attempt invoking the inner function if it is not a function', function () {

		expect(() => sut(['anything'], 'not a function')).not.toThrow();

	});
});
