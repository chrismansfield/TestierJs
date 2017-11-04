import recordError from '../../record';
import GeneratorFixture from '../GeneratorFixture';

describe('GeneratorFixture', () => {
    describe('Basic behaviour', () => {
        const generator = function* () { }; // eslint-disable-line no-empty-function

        it('should throw an error if trying to set flow after iteration has begun', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            const actual = recordError(() => sut.setFlow());

            expect(actual).toBeInstanceOf(Error);
        });

        it('should throw an error if trying to set generator after iteration has begun', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            const actual = recordError(() => sut.setGenerator());

            expect(actual).toBeInstanceOf(Error);
        });

        it('should throw an error if trying to start iterating without setting a generator', () => {
            const sut = new GeneratorFixture();

            const actual = recordError(() => sut.beginIterating());

            expect(actual).toBeInstanceOf(Error);
        });

        it('should throw an error if trying to move the generator without starting', () => {
            const sut = new GeneratorFixture(generator);

            const actual = recordError(() => sut.forwardTo(2));

            expect(actual).toBeInstanceOf(Error);
        });
    });

    describe('Simple sequential generators', () => {
        const generator = function* () {
            yield 'first';
            yield 'second';
            yield 'third';
            yield 'fourth';
        };

        it('should forward to first step immediately when beginning', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();

            expect(sut.value).toBe('first');
        });

        it('should not be done when the generator is not consumed', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(2);

            expect(sut.done).toBe(false);
        });

        it('should forward to second step when calling forwardTo with second steps name', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(2);

            expect(sut.value).toBe('second');
        });

        it('should remain at second step if attemtpting to "reverse"', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(3);
            sut.forwardTo(2); // this should not do anything

            expect(sut.value).toBe('third');
        });

        it('should set done to true when the generator has been consumed', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(4);
            sut.next();

            expect(sut.done).toBe(true);
        });

        it('should move to the correct step based on flow name', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second' }, { name: 'third' }, { name: 'fourth' }]);

            sut.beginIterating();
            sut.forwardTo('third');

            expect(sut.value).toBe('third');
        });

        it('should remain at current step if previous step is supplies based on flow name', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second' }, { name: 'third' }, { name: 'fourth' }]);

            sut.beginIterating();
            sut.forwardTo('fourth');
            sut.forwardTo('second'); // this should do nothing

            expect(sut.value).toBe('fourth');
        });

        it('goes to the next step when calling next()', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.next();

            expect(sut.value).toBe('second');
        });
    });

    describe('Simple sequential generator with incoming values', () => {
        let second;
        let third;

        const generator = function* () {
            second = yield 'first';
            third = yield second;
            yield third;
        };

        afterEach(() => {
            second = null;
            third = null;
        });

        it('should send the provided value to target step', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            const expected = 'second value';

            sut.beginIterating();
            sut.forwardTo(2, 'second value');

            expect(sut.value).toBe(expected);
        });

        it('should not pass the value to any other step than the target', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(3, 'third value');

            expect(second).not.toBe('third value');
        });

        it('should send the provided value to the target step based on flow name', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second' }, { name: 'third' }]);

            sut.beginIterating();
            sut.forwardTo('second', 'second value from name');

            expect(sut.value).toBe('second value from name');
        });

        it('should use default values from flow steps if defined', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second', defaultValue: 'default second' }, { name: 'third' }]);

            sut.beginIterating();
            sut.forwardTo('second');

            expect(sut.value).toBe('default second');
        });

        it('should use default values from flow steps if defined even when target is further ahead', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second', defaultValue: 'default second on the fly' }, { name: 'third' }]);

            sut.beginIterating();
            sut.forwardTo('third');

            expect(second).toBe('default second on the fly');
        });

        it('should send the provided value to the next step', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.next('second value from next');

            expect(sut.value).toBe('second value from next');
        });

        it('should use default values from flow steps if defined', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second', defaultValue: 'default second' }, { name: 'third' }]);

            sut.beginIterating();
            sut.forwardTo('second');

            expect(sut.value).toBe('default second');
        });

        it('should use provided value instead of default value if provider', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([{ name: 'second' }, { name: 'third', defaultValue: 'third to be overwritten :(' }]);

            sut.beginIterating();
            sut.forwardTo('third', 'provided value');

            expect(sut.value).toBe('provided value');
        });
    });

    describe('Passing value to generator', () => {
        const generator = function* generator(...args) {
            yield args;
        };

        it('should pass any arguments from beginIterating to the generator', () => {
            const sut = new GeneratorFixture(generator);

            sut.beginIterating('a string', 1337);

            expect(sut.value).toEqual(['a string', 1337]);
        });
    });

    describe('throwing exceptions', () => {
        let caughtError;
        const generator = function* generator() {
            try {
                yield 'first';
                yield 'second';
            } catch (e) {
                caughtError = e;
                yield e;
            }
            yield 'end';
        };

        afterEach(() => {
            caughtError = null;
        });

        it('should throw the provided value if the throw flag is set', () => {
            const sut = new GeneratorFixture(generator);
            sut.beginIterating();

            sut.forwardTo(2, 'error', true);

            expect(sut.value).toBe('error');
        });

        it('should throw if the default flow is set to throw and no value is provided', () => {
            const sut = new GeneratorFixture(generator);
            sut.setFlow([
                { name: 'afterFirst', throws: 'mega-error' },
            ]);
            sut.beginIterating();

            sut.forwardTo('afterFirst');

            expect(sut.value).toBe('mega-error');
        });

        it('should throw when passing over a step with default throws', () => {
            const sut = new GeneratorFixture(generator);
            sut.setFlow([
                { name: 'afterFirst' },
                { name: 'afterSecond', throws: 'second-error' },
                { name: 'afterError' },
            ]);
            sut.beginIterating();

            sut.forwardTo('afterError');

            expect(caughtError).toBe('second-error');
        });
    });

    describe('chaining', () => {
        const generator = function* generator(arg) {
            yield arg;
            yield 'more stuff';
            yield 'yup';
            yield 'end';
        };

        it('should allow chaining of all public methods', () => {
            const sut = new GeneratorFixture();

            sut.setGenerator(generator)
                .setFlow([
                    { name: 'afterFirst' },
                    { name: 'afterMoreStuff' },
                    { name: 'afterYup' },
                ])
                .beginIterating()
                .forwardTo('afterFirst')
                .next()
                .next();

            expect(sut.value).toBe('end');
        });
    });
});
