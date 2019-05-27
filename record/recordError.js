
/**
 * Records anything thrown by the provided invocation,
 * allowing a proper arrange-act-assert workflow when testing code that throws.
 * @param {Function} invocation The invocation to record exceptions from
 */
export default function recordError(invocation) {
    if (typeof (invocation) !== 'function') {
        throw new TypeError('Invocation provided to recordError must be a function');
    }

    try {
        invocation();
    } catch (error) {
        return error;
    }
    return null;
}
