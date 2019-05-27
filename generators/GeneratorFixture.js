/**
 * @typedef GeneratorFixtureFlowStep A defined step in the code path of the unerlying generator.
 * @property {string} name The name of the step. This name is used when calling forwardTo
 * @property {string} [defaultValue] The default value of the step,
 * which will be returned by the matching yield statement,
 * unless overridden while forwarding.
 * If omitted, no value will be returned for this step
 * @property {string} [throws] The default value to throw at the matching yield statement.
 * Takes precedence over defaultValue.
 * If ommited, nothing will be thrown at the yield statement.
 */

/**
 * Fixture used for managing control flow of generators.
 */
export default class GeneratorFixture {

    /**
     * Creates a new instance of the GeneratorFixture
     * @param {Generator} generator The generator system under test
     */
    constructor(generator) {
        this._steps = [];
        this.setGenerator(generator);
    }

    /**
     * Sets the generator. Cannot be called after the generator has been called.
     * @param {Generator} generator The generator system under test
     * @returns {GeneratorFixture} The current instance for chaining
     */
    setGenerator(generator) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture generator once the fixture has begun iterating');
        }
        this._generator = generator;
        return this;
    }

    /**
     * Sets the named flow of the GeneratorFixture. This can be used to forward a generator to a certain state.
     * These steps are sequential. If a generator has muiltple code paths,
     * use multiple instances of the GeneratorFixture.
     * Cannot be called once the generator has been called
     * @param {GeneratorFixtureFlowStep} steps The steps to be available when forwarding
     * @returns {GeneratorFixture} The current instance for chaining
     */
    setFlow(steps) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture flow once the fixture has begun iterating');
        }
        this._steps = steps;
        return this;
    }

    /**
     * Calls the generator function, creating the iterator and moving to the right of the first yield statement.
     * Calling this is a prerequisite for any other forwarding calls to the fixture,
     * @param {...any} args Any number of arguments to be passed along to the underlying generator function
     */
    beginIterating(...args) {
        if (!this._generator) {
            throw new Error('Cannot begin iterating without a generator function. Provide one via the constructor or the setGenerator method');
        }
        this._running = true;
        this._iterator = this._generator(...args);
        this._currentIndex = 0;
        this._internalForwardOne();
        return this;
    }

    /**
     * Moves the underlying iterator to the next step, ignoring any default values defined in the flow
     * @param {any} value The value that the current yield statement should return.
     * @param {bool} throws Indicates whether the values should be thrown as an error, or returned as a result.
     */
    next(value, throws) {
        this._internalForwardOne(value, throws);
        return this;
    }

    _internalForwardOne(value, throws) {
        this._checkIfRunnable();

        let step;
        if (throws) {
            step = this._iterator.throw(value);
        } else {
            step = this._iterator.next(value);
        }
        this._currentIndex += 1;
        this.value = step.value;
        this.done = step.done;
    }

    _checkIfRunnable() {
        if (!this._generator) {
            throw new Error('Cannot begin iterating without a generator function. Provide one via the constructor or the setGenerator method');
        }
        if (!this._running) {
            throw new Error('Cannot move forward before iteration has started. Make sure to call beginIterating before forwarding');
        }
    }

    /**
     * Forwards the underlying generator to the provided step.
     * Starting from the current index of the iterator, moving through to the target step.
     * Any default values or throwing statements for yields defined
     * in the fixtures flow that are forwarded over will be used.
     * @param {int|string} target The target step. This could either be a step index (starting at 1),
     * or the name of a step defined in the fixtures flow.
     * @param {any} [value] The value to return (or throw) from the yield statement.
     * Overrides the default value from the flow.
     * @param {bool} throws Indicates whether the values should be thrown as an error, or returned as a result.
     */
    forwardTo(target, value, throws) {
        this._checkIfRunnable();
        const targetIndex = typeof target === 'string' ? this._findStepIndexByName(target) : target;

        for (let i = this._currentIndex; i < targetIndex; i += 1) {
            const step = this._steps[this._currentIndex - 1] || {};
            if (this._currentIndex === targetIndex - 1) {
                const actualValue = arguments.length > 1 ? value : step.defaultValue || step.throws;
                this._internalForwardOne(actualValue, throws || !!step.throws);
            } else {
                this._internalForwardOne(step.defaultValue || step.throws, !!step.throws);
            }
        }
        return this;
    }

    _findStepIndexByName(name) {
        return this._steps.indexOf(this._findStepByName(name)) + 2;
    }

    _findStepByName(name) {
        return this._steps.find(step => step.name === name);
    }

}
