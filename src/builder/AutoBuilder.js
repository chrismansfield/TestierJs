import Builder from './Builder';

const ignorePropPattern = /with(out)?([A-Z]).*/;
const generatedMethods = prop => !ignorePropPattern.test(prop);
const toKeyValueTupleWithValuesFrom = obj => prop => [prop, obj[prop]];
const fromTupleToObject = (obj, [key, value]) => ({
    ...obj,
    [key]: value,
});

function withFunctionFor(prop) {
    return function withFunc(value) {
        this[prop] = value;
        return this;
    };
}

function withoutFunctionFor(prop) {
    return function withoutFunc() {
        delete this[prop];
        return this;
    };
}

/**
 * Extension of the Builder class, automatically creating with and without methods for all predefined properties.
 * The methods generated are stripped of any initial underscores, and properly camelCased.
 * For instance, passing {_prop: 'value'} as initial properties
 * will generate the methods withProp(newValue) and withoutProp().
 * All other build semantics are shared with the parent class, Builder
 */
export default class AutoBuilder extends Builder {

    /**
     * Instantiates a new AutoBuilder, automatically creating matching with and without methods
     * for all provided default properties
     * @param {object} initialProps The initial values of the properties of the builder
     */
    constructor(initialProps) {
        super(initialProps);

        if (typeof (initialProps) !== 'object' || Object.keys(initialProps).length === 0) {
            throw new TypeError('When using the AutoBuilder, you must supply at least one property to its constructor. Please, use the basic Builder class if no initial props can be passed');
        }

        Object.keys(initialProps).forEach((prop) => {
            const propName = prop.startsWith('_') ? prop.replace('_', '') : prop;
            const funcName = propName.substring(0, 1).toUpperCase() + propName.substring(1);
            this[`with${funcName}`] = withFunctionFor(prop).bind(this);
            this[`without${funcName}`] = withoutFunctionFor(prop).bind(this);
        });
    }

    /**
     * Creates a new object based on the properties of the builder.
     * The object will be containing all properties from the builder, with prefixed underscores removed.
     * @returns {object} A new object with the builder's properties mapped
     */
    build() {
        const realProps = Object.keys(this)
            .filter(generatedMethods)
            .map(toKeyValueTupleWithValuesFrom(this))
            .reduce(fromTupleToObject, {});

        return super.build.apply(realProps);
    }

}
