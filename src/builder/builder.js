
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
		Object.keys(properties).forEach(property => {
			if (this.hasOwnProperty(property)) {
				this[property] = properties[property];
			} else if (this.hasOwnProperty(`_${property}`)) {
				this[`_${property}`] = properties[property];
			}
		});
		return this;
	}

	/**
	 * Creates a new object based on the properties of the builder. The object will be a simple object literal
	 * containing all properties from the builder, with prefixed underscores removed.
	 * @returns {object} A new object with the builder's properties mapped
	 */
	build() {
		return Object.keys(this).reduce((object, property) => {
			const outputPropertyName = property.replace('_', '');
			object[outputPropertyName] = this[property];
			return object;
		}, {});
	}

}
