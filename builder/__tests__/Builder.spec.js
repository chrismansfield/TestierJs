import Builder from '../Builder';

/**
 * Used to create proper test scenarios for the Builder class
 * @private
 */
class TestBuilder extends Builder {

    constructor(initialProperties) {
        super();

        this.defineProperties(initialProperties);
    }

    defineProperties(properties) {
        Object.assign(this, properties);
    }

    defineProperty(name, value) {
        this[name] = value;
    }

}

describe('Builder', () => {
    describe('constructor', () => {
        it('should initialize any properties provided', () => {
            const props = {
                prop1: 1,
                prop2: 'dummy',
            };

            const sut = new Builder(props);
            const actual = sut.build();

            expect(actual).toEqual(props);
        });
    });

    describe('with()', () => {
        it('should set values of properties with matching names', () => {
            const sut = new TestBuilder({
                firstProperty: 'initial first',
                secondProperty: 'inital second',
            });

            sut.with({
                firstProperty: 'new first',
                secondProperty: 'new second',
            });

            expect(sut).toEqual(expect.objectContaining({
                firstProperty: 'new first',
                secondProperty: 'new second',
            }));
        });

        it('should not set properties not already defined', () => {
            const sut = new TestBuilder();

            sut.with({
                nonDefinedProperty: 'this should not be set',
            });

            expect(sut.nonDefinedProperty).toBeUndefined();
        });

        it('should set values of properties with names matching using an underscore prefix', () => {
            const sut = new TestBuilder({
                _firstProperty: 'inital first',
                _secondProperty: 'inital second',
            });

            sut.with({
                firstProperty: 'new first',
                secondProperty: 'new second',
            });

            expect(sut).toEqual(expect.objectContaining({
                _firstProperty: 'new first',
                _secondProperty: 'new second',
            }));
        });

        it('should return itself for chaining', () => {
            const sut = new TestBuilder();

            const actual = sut.with({});

            expect(actual).toBe(sut);
        });
    });

    describe('build()', () => {
        it('should return an object with properties matching the builders properties', () => {
            const sut = new TestBuilder({
                firstProperty: 'first value',
                secondProperty: 'second value',
            });

            const actual = sut.build();

            expect(actual).toEqual({
                firstProperty: 'first value',
                secondProperty: 'second value',
            });
        });

        it('should return an object with properties matchin the builders properties without prefixing underscores', () => {
            const sut = new TestBuilder({
                _firstProperty: 'first value',
                _secondProperty: 'second value',
            });

            const actual = sut.build();

            expect(actual).toEqual({
                firstProperty: 'first value',
                secondProperty: 'second value',
            });
        });

        it('should return an object with properties matchin the builders properties with any non-prefix underscores', () => {
            const sut = new TestBuilder({
                _first_property: 'first value',
                second_property: 'second value',
            });

            const actual = sut.build();

            expect(actual).toEqual({
                first_property: 'first value',
                second_property: 'second value',
            });
        });
    });

    describe('without', () => {
        it('should build object without specified property', () => {
            const sut = new TestBuilder({
                first_property: 'first value',
                second_property: 'second value',
            });

            sut.without('first_property');
            const actual = sut.build();

            expect(Object.keys(actual)).not.toContain('first_property');
        });

        it('should build object without specified property when defined property is prefixed with underscore', () => {
            const sut = new TestBuilder({
                _first_property: 'first value',
                _second_property: 'second value',
            });

            sut.without('first_property');
            const actual = sut.build();

            expect(Object.keys(actual)).not.toContain('first_property');
        });
    });
});
