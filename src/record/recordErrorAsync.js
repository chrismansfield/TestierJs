
export default async function recordErrorAsync(promise) {
    if (!(promise instanceof Promise)) {
        throw new TypeError('Value passed to recordErrorAsync must be a promise.');
    }

    try {
        await promise;
    } catch (e) {
        return e;
    }

    return null;
}
