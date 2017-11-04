import recordError from '../../record';
import sut from '../forAll';

describe('forAll', () => {
    [undefined, null, [], 1, ''].forEach((value) => {
        it(`should not call the inner function for value ${value && '[]'}`, () => {
            const innerFunction = jest.fn();

            sut(value, innerFunction);

            expect(innerFunction).not.toHaveBeenCalled();
        });
    });

    it('should call the inner function once for each value', () => {
        const values = [1, 2, 3, 'a', 'b', 'c'];
        const invocations = [];

        sut(values, (value) => { invocations.push(value); });

        expect(invocations).toEqual(values);
    });

    it('Should throw a clear error if the invocation is not a function', () => {
        const actual = recordError(() => sut(['anything'], 'not a function'));

        expect(actual).toBeInstanceOf(TypeError);
    });
});
