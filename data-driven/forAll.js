
/**
 * Invokes a function for each value in a provided array.
 * Useful when one or more test cases are the same for multiple sets of inputs.
 * @param {any[]} values Array of values to share the same tests.
 * @param {function} invoke Function that is invoked once per element in the provided array
 */
export default function forAll(values, invoke) {
    if (typeof (invoke) !== 'function') {
        throw new TypeError('parameter invoke of function forAll must be a function.');
    }
    if (Array.isArray(values)) {
        values.forEach(invoke);
    }
}
