
const stringConverters = new Map([
    ['undefined', () => 'undefined'],
    ['number', value => value],
    ['boolean', value => value],
    ['string', value => `'${value}'`],
    ['symbol', value => value.toString()],
    ['function', value => (value.name ? `function ${value.name}()` : 'function()')],
    ['object', value => stringFromObject(value)],
]);

export default function p(strings, ...values) {
    return strings.reduce(
        (result, string, i) =>
            result.concat(string, values.length > i
                ? stringConverters.get(typeof (values[i]))(values[i])
                : ''),
        '',
    );
}

function stringFromObject(object) {
    if (object === null) {
        return 'null';
    }
    if (Array.isArray(object)) {
        return getArrayValue(object);
    }
    return getObjectValue(object);
}

function getArrayValue(array) {
    const customValue = getCustomValue(array, Array.prototype);
    if (customValue) {
        return customValue;
    }
    const json = JSON.stringify(array);
    return json.length > 25 ? `${json.substr(0, 25)}...]` : json;
}

function getCustomValue(obj, prototype) {
    let value;
    if (obj.toString !== prototype.toString) {
        value = obj.toString();
    }
    if (typeof (value) !== 'string' && obj.valueOf !== prototype.valueOf) {
        value = obj.valueOf();
    }
    return typeof (value) === 'string' ? value : null;
}

function getObjectValue(object) {
    const customValue = getCustomValue(object, Object.prototype);
    if (customValue) {
        return customValue;
    }
    const json = JSON.stringify(object);
    return json.length > 25 ? `${json.substr(0, 25)}...}` : json;
}
