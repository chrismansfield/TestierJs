

export default class GeneratorFixture {

    constructor(generator) {
        this._steps = [];
        this.setGenerator(generator);
    }

    setFlow(steps) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture flow once the fixture has begun iterating');
        }
        this._steps = steps;
    }

    setGenerator(generator) {
        if (this._running) {
            throw new Error('Cannot set the GeneratorFixture generator once the fixture has begun iterating');
        }
        this._generator = generator;
    }

    forwardTo(target, value) {
        if (!this._running) {
            throw new Error('Cannot move forward before iteration has started. Make sure to call beginIterating before forwarding');
        }

        const targetIndex = typeof (target) === 'string'
            ? this.findStepIndexByName(target)
            : target;

        for (let i = this._currentIndex; i < targetIndex; i++) {
            const step = this._steps[this._currentIndex - 1] || {};
            if (this._currentIndex == targetIndex - 1) {
                this._internalForwardOne(value || step.defaultValue);
            } else {
                this._internalForwardOne(step.defaultValue);
            }

        }
    }

    findStepIndexByName(name) {
        return this._steps.indexOf(this.findStepByName(name)) + 2;
    }

    findStepByName(name) {
        return this._steps.find(step => step.name === name);
    }

    beginIterating() {
        if (!this._generator) {
            throw new Error('Cannot begin iterating without a generator function. Provide one via the constructor or the setGenerator method');
        }
        this._running = true;
        this._iterator = this._generator();
        this._currentIndex = 0;
        this._internalForwardOne();
    }

    _internalForwardOne(value) {
        const step = this._iterator.next(value);
        this._currentIndex++;
        this.value = step.value;
        this.done = step.done;
    }

}
