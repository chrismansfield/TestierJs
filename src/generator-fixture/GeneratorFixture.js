export default class GeneratorFixture {

    constructor(generator) {
        this._steps = [];
        this.setGenerator(generator);
    }

    setGenerator(generator) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture generator once the fixture has begun iterating');
        }
        this._generator = generator;
        return this;
    }

    setFlow(steps) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture flow once the fixture has begun iterating');
        }
        this._steps = steps;
        return this;
    }

    forwardTo(target, value, throws) {
        this._checkIfRunnable();
        const targetIndex = typeof target === 'string' ? this._findStepIndexByName(target) : target;

        for (let i = this._currentIndex; i < targetIndex; i += 1) {
            const step = this._steps[this._currentIndex - 1] || {};
            if (this._currentIndex === targetIndex - 1) {
                this._internalForwardOne(value || step.defaultValue || step.throws, throws || !!step.throws);
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

    next(value) {
        this._internalForwardOne(value);
        return this;
    }

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

    _checkIfRunnable() {
        if (!this._generator) {
            throw new Error('Cannot begin iterating without a generator function. Provide one via the constructor or the setGenerator method');
        }
        if (!this._running) {
            throw new Error('Cannot move forward before iteration has started. Make sure to call beginIterating before forwarding');
        }
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

}
