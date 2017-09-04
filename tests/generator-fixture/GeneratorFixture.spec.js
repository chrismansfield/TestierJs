import GeneratorFixture from '../../src/generator-fixture/GeneratorFixture';

describe('GeneratorFixture', function () {

    describe('Basic behaviour', function(){

        const generator = function*(){};

        it('should throw an error if trying to set flow after iteration has begun', function(){
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            expect(() => sut.setFlow()).toThrow();
        });

        it('should throw an error if trying to set generator after iteration has begun', function(){
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.beginIterating();

            expect(() => sut.setGenerator()).toThrow();
        });

        it('should throw an error if trying to start iterating without setting a generator', function(){
            const sut = new GeneratorFixture();
            
            expect(() => sut.beginIterating()).toThrow();
        });

        it('should throw an error if trying to move the generator without starting', function(){
            const sut = new GeneratorFixture();

            expect(() => sut.forwardTo(2)).toThrow();
        });

    });

    describe('Simple sequential generators', function () {

        const generator = function* () {
            yield 'first';
            yield 'second';
            yield 'third';
            yield 'fourth';
        };

        it('should forward to first step immediately when beginning', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();

            expect(sut.value).toBe('first');
        });

        it('should not be done when the generator is not consumed', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(2);

            expect(sut.done).toBe(false);
        });

        it('should forward to second step when calling forwardTo with second steps name', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(2);

            expect(sut.value).toBe('second');
        });

        it('should remain at second step if attemtpting to "reverse"', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(3);
            sut.forwardTo(2); // this should not do anything

            expect(sut.value).toBe('third');
        });

        it('should set done to true when the generator has been consumed', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(4);
            sut._internalForwardOne();

            expect(sut.done).toBe(true);
        });

        it('should move to the correct step based on flow name', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second' },
                { name: 'third' },
                { name: 'fourth' }
            ]);

            sut.beginIterating();
            sut.forwardTo('third');

            expect(sut.value).toBe('third');
        });

        it('should remain at current step if previous step is supplies based on flow name', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second' },
                { name: 'third' },
                { name: 'fourth' }
            ]);

            sut.beginIterating();
            sut.forwardTo('fourth');
            sut.forwardTo('second'); //this should do nothing

            expect(sut.value).toBe('fourth');
        });

    });

    describe('Simple sequential generator with incoming values', function () {

        let second, third;

        const generator = function* () {
            second = yield 'first';
            third = yield second;
            yield third;
        };

        afterEach(function () {
            second = null;
            third = null;
        });

        it('should send the provided value to target step', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            const expected = 'second value';

            sut.beginIterating();
            sut.forwardTo(2, 'second value');

            expect(sut.value).toBe(expected);
        });

        it('should not pass the value to any other step than the target', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);

            sut.beginIterating();
            sut.forwardTo(3, 'third value');

            expect(second).not.toBe('third value');
        });

        it('should send the provided value to the target step based on flow name', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second' },
                { name: 'third' }
            ]);

            sut.beginIterating();
            sut.forwardTo('second', 'second value from name');

            expect(sut.value).toBe('second value from name');
        });

        it('should use default values from flow steps if defined', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second', defaultValue: 'default second' },
                { name: 'third' }
            ]);

            sut.beginIterating();
            sut.forwardTo('second');

            expect(sut.value).toBe('default second');
        });

        it('should use default values from flow steps if defined even when target is further ahead', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second', defaultValue: 'default second on the fly' },
                { name: 'third' }
            ]);

            sut.beginIterating();
            sut.forwardTo('third');

            expect(second).toBe('default second on the fly');
        });

        it('should use provided value instead of default value if provider', function () {
            const sut = new GeneratorFixture();
            sut.setGenerator(generator);
            sut.setFlow([
                { name: 'second' },
                { name: 'third', defaultValue: 'third to be overwritten :(' }
            ]);

            sut.beginIterating();
            sut.forwardTo('third', 'provided value');

            expect(sut.value).toBe('provided value');
        });

    });

});