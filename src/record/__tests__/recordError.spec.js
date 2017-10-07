import sut from '../recordError';

describe('recordException', () => {
    it('should return the exception thrown by its invocation', () => {
        const expected = new Error('dummy');

        const actual = sut(() => { throw expected; });

        expect(actual).toBe(expected);
    });

    it('should return undefined if nothing is thrown', () => {
        const actual = sut(() => { /* no exceptions here. Move along */ });

        expect(actual).toBeUndefined();
    });
});
