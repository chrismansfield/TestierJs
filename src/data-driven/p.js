

export default function p(strings, ...values) {
    let prettyString = '';
    for (let i = 0; i < strings.length; i += 1) {
        prettyString = prettyString.concat(strings[i], values.length > i ? getValue(values[i]) : '');
    }
    return prettyString;
}

function getValue(value) {
    switch (typeof (value)) {
        case 'undefined':
            return 'undefined';
        case 'number':
        case 'boolean':
            return value;
        case 'string':
            return `'${value}'`;
        case 'symbol':
            return value.toString();
        case 'function':
            return value.name ? `function ${value.name}()` : 'function()';
        case 'object':
            if (value === null) {
                return 'null';
            }
            if (Array.isArray(value)) {
                return getArrayValue(value);
            }
            return getObjectValue(value);

        default: return '';
    }
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
