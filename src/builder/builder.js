const { hasOwnProperty } = Object.prototype;

/**
 * Base class for test data builder. Provides the generic with() method for easy test configuration
 * and the generic build() method for standard object literal construction
 * @abstract
 */
export default class Builder {

    /**
     * Merges the values of the provided object into the builder. Only already defined properties are merged.
     * Matches builder properties by name, and then by name prefixed by an underscore.
     * @param {object} properties The object containing the properties to merge.
     * @returns {Builder} The instance that the with() method was called on for chaining
     */
    with(properties) {
        Object.keys(properties).forEach((property) => {
            const target = hasOwnProperty.call(this, property) ? property : `_${property}`;
            if (hasOwnProperty.call(this, target)) {
                this[target] = properties[property];
            }
        });
        return this;
    }

    /**
     * Removes a defined property from the builder, causing it to be completely omitted from the build output
     * @param {string} property The property to remove from the builder
     * @returns {Builder} The instance that the with() method was called on for chaining
     */
    without(property) {
        const target = hasOwnProperty.call(this, property) ? property : `_${property}`;
        delete this[target];
        return this;
    }

    /**
     * Creates a new object based on the properties of the builder. The object will be a simple object literal
     * containing all properties from the builder, with prefixed underscores removed.
     * @returns {object} A new object with the builder's properties mapped
     */
    build() {
        return Object.keys(this).reduce((object, property) => {
            const outputPropertyName = property.startsWith('_') ? property.replace('_', '') : property;
            return {
                ...object,
                [outputPropertyName]: this[property],
            };
        }, {});
    }

}
