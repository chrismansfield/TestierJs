import sut from '../recordError';
import forAll from '../../data-driven/forAll';

describe('recordException', () => {
    forAll([undefined, null, 'hello', 1337, true, [], {}], (value) => {
        it(`should throw if provided invocation is ${value}`, () => {
            const actual = () => sut(value);

            expect(actual).toThrow(TypeError);
        });
    });

    it('should return the exception thrown by its invocation', () => {
        const expected = new Error('dummy');

        const actual = sut(() => { throw expected; });

        expect(actual).toBe(expected);
    });

    it('should return null if nothing is thrown', () => {
        const actual = sut(() => { /* no exceptions here. Move along */ });

        expect(actual).toBeNull();
    });
});
