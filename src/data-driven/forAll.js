
export default function forAll(values, invoke) {
    if (typeof (invoke) !== 'function') {
        throw new TypeError('parameter invoke of function forAll must be a function.');
    }
    if (Array.isArray(values)) {
        values.forEach(invoke);
    }
}
