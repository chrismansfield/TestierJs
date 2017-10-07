import GeneratorFixture from '../GeneratorFixture';

describe('GeneratorFixture', () => {
    describe('Basic behaviour', () => {
        const generator = function* () { }; // eslint-disable-line no-empty-function

        it('should throw an error if trying to set flow after iteration has begun', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            expect(() => sut.setFlow()).toThrow();
        });

        it('should throw an error if trying to set generator after iteration has begun', () => {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            expect(() => sut.setGenerator()).toThrow();
        });

        it('should throw an error if trying to start iterating without setting a generator', () => {
            const sut = new GeneratorFixture();

            expect(() => sut.beginIterating()).toThrow();
        });

        it('should throw an error if trying to move the generator without starting', () => {
            const sut = new GeneratorFixture();

            expect(() => sut.forwardTo(2)).toThrow();
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
});
