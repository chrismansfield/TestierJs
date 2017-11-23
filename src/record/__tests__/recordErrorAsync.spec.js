import forAll from '../../data-driven';
import sut from '../recordErrorAsync';

describe('recordErrorAsync', () => {
    const INVALID_VALUES = [undefined, null, [], 'hello', {}];
    forAll(INVALID_VALUES, (value) => {
        it(`should throw an error if provided value is ${value}`, () => {
            const actual = sut(value);

            expect(actual).rejects.toBeInstanceOf(TypeError);
        });
    });

    it('should return a promise resolving to the rejection of the provided promise', async () => {
        const error = new Error('dummy error');
        const promise = new Promise((resolve, reject) => reject(error));

        const actual = sut(promise);

        await expect(actual).resolves.toBe(error);
    });

    it('should return a promise resolving to null if the provided promise resolves', async () => {
        const promise = new Promise(resolve => resolve());

        const actual = sut(promise);

        await expect(actual).resolves.toBeNull();
    });
});
