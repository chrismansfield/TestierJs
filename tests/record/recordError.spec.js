import sut from '../../src/record/recordError';

describe('recordException', function () {

    it('should return the exception thrown by its invocation', function () {
        const expected = new Error('dummy');

        const actual = sut(() => { throw expected; });

        expect(actual).toBe(expected);
    });

    it('should return undefined if nothing is thrown', function () {
        const actual = sut(() => { /*no exceptions here. Move along*/ });

        expect(actual).toBeUndefined();
    });

});