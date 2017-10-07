
/**
 * Records anything thrown by the provided invocation,
 * allowing a proper arrange-act-assert workflow when testing code that throws.
 * @param {Function} invocation The invocation to record exceptions from
 */
export default function recordError(invocation) {
    try {
        invocation();
    } catch (error) {
        return error;
    }
    return undefined;
}
