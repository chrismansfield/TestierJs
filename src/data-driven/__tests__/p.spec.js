import p from '../p';
import { forAll } from '../../../dist/index';

const NON_PRIMITIVES = [{}, []];

describe('p - pretty printing', () => {
    describe('primitive values', () => {
        it('returns a string without variables unmodified', () => {
            const actual = p`Hello Tests!`;

            expect(actual).toEqual('Hello Tests!');
        });

        it('returns a string with numbers resolved as usual', () => {
            const int = 1337;
            const float = 13.37;

            const actual = p`int is ${int} and float is ${float}`;

            expect(actual)
                .toEqual('int is 1337 and float is 13.37');
        });

        it('returns a string with strings resolved with quotes', () => {
            const string1 = 'Herp';
            const string2 = 'Derp';

            const actual = p`Hello ${string1} and ${string2}, how are you?`;

            expect(actual)
                .toEqual('Hello \'Herp\' and \'Derp\', how are you?');
        });

        it('returns a string with booleans as usual', () => {
            const yay = true;
            const ney = false;

            const actual = p`Yay? ${yay}!, Nay? ${ney} (that's what horses say)`;

            expect(actual).toEqual('Yay? true!, Nay? false (that\'s what horses say)');
        });

        it('return a string with symbols prefixed with Symbol', () => {
            const symbol = Symbol('ical'); // pun intended?

            const actual = p`These various designs no doubt all had some ${symbol} significance.`;

            expect(actual)
                .toEqual('These various designs no doubt all had some Symbol(ical) significance.');
        });

        it('returns a string with the name of the function', () => {
            const fn = function yesItIs() { };

            const actual = p`Is this even feasible? ${fn}`;

            expect(actual)
                .toEqual('Is this even feasible? function yesItIs()');
        });

        it('returns a string with anonymous function name', () => {
            const actual = p`This feels kinda weird. ${() => { }}`;

            expect(actual)
                .toEqual('This feels kinda weird. function()');
        });

        it('returns a string with the word undefined and null for undefined and null values', () => {
            const actual = p`Is ${null} > ${undefined}?`;

            expect(actual)
                .toEqual('Is null > undefined?');
        });
    });

    describe('Arrays', () => {
        it('returns a string with the value [] for empty arrays', () => {
            const emptyArray = [];

            const actual = p`How do you create an empty array? Like so: ${emptyArray}`;

            expect(actual)
                .toEqual('How do you create an empty array? Like so: []');
        });

        it('returns a string with the JSON representation of an array, capped at 25 chars', () => {
            const array = ['123', 456, 'and so it continues, into infinty and beyond'];

            const actual = p`${array} <- see what I did there`;

            expect(actual)
                .toEqual('["123",456,"and so it con...] <- see what I did there');
        });

        it('returns a string using the array\'s toString method, if it has been overridden', () => {
            const array = ['any', 'value'];
            array.toString = () => 'custom string value!';

            const actual = p`${array} Trust me, that's an array`;

            expect(actual)
                .toEqual('custom string value! Trust me, that\'s an array');
        });

        it('returns a string using the array\'s valueOf method, if it has been overridden and the toString method is not overridden', () => {
            const array = ['any', 'value'];
            array.valueOf = () => 'custom value of!';

            const actual = p`${array} Wait, what's the difference here?`;

            expect(actual)
                .toEqual('custom value of! Wait, what\'s the difference here?');
        });

        it('returns a string using the array\'s toString method if both toString and valueOf has been overridden', () => {
            const array = ['any', 'value'];
            array.toString = () => 'toString value!';
            array.valueOf = () => '';

            const actual = p`What do we want? ${array}`;

            expect(actual)
                .toEqual('What do we want? toString value!');
        });

        forAll(NON_PRIMITIVES, (nonPrimitive) => {
            it(p`returns a string using the array's valueOf method if both toString and valueOf are overridden but toString returns non-primitive ${nonPrimitive}`, () => {
                const array = ['any', 'value'];
                array.toString = () => nonPrimitive; // Very bad implementation, don't do this at home!
                array.valueOf = () => 'valueOf';

                const actual = p`This is convention, apparently. ${array}`;

                expect(actual)
                    .toEqual('This is convention, apparently. valueOf');
            });

            it(p`returns a string using the default p behaviour method if both toString and valueOf are overridden but both return non-primitive ${nonPrimitive}`, () => {
                const array = ['any', 'value'];
                array.toString = () => nonPrimitive;
                array.valueOf = () => nonPrimitive;

                const actual = p`Lots of hoops to implement this. ${array}`;

                expect(actual)
                    .toEqual('Lots of hoops to implement this. ["any","value"]');
            });
        });
    });

    describe('Objects', () => {
        it('returns a string with the value {} for empty objects', () => {
            const object = {};

            const actual = p`How do you create an empty object? Like so: ${object}`;

            expect(actual)
                .toEqual('How do you create an empty object? Like so: {}');
        });

        it('returns a string with the JSON representation of an object capped at 25 chars', () => {
            const object = { p1: 'p 1', p2: 'to infinity and beyond!' };

            const actual = p`${object} <- did it again!`;

            expect(actual)
                .toEqual('{"p1":"p 1","p2":"to infi...} <- did it again!');
        });

        it('returns a string using the object\'s toString method, if it has been overridden', () => {
            const object = { any: 'value' };
            object.toString = () => 'custom string value!';

            const actual = p`${object} Trust me, that's an object`;

            expect(actual)
                .toEqual('custom string value! Trust me, that\'s an object');
        });

        it('returns a string using the object\'s valueOf method, if it has been overridden and the toString method is not overridden', () => {
            const object = { any: 'value' };
            object.valueOf = () => 'custom value of!';

            const actual = p`${object} Wait, what's the difference here?`;

            expect(actual)
                .toEqual('custom value of! Wait, what\'s the difference here?');
        });

        it('returns a string using the object\'s toString method if both toString and valueOf has been overridden', () => {
            const object = { any: 'value' };
            object.toString = () => 'toString value!';
            object.valueOf = () => '';

            const actual = p`What do we want? ${object}`;

            expect(actual)
                .toEqual('What do we want? toString value!');
        });

        forAll(NON_PRIMITIVES, (nonPrimitive) => {
            it(p`returns a string using the object's valueOf method if both toString and valueOf are overridden but toString returns non-primitive ${nonPrimitive}`, () => {
                const object = { any: 'value' };
                object.toString = () => nonPrimitive; // Very bad implementation, don't do this at home!
                object.valueOf = () => 'valueOf';

                const actual = p`This is convention, apparently. ${object}`;

                expect(actual)
                    .toEqual('This is convention, apparently. valueOf');
            });

            it(p`returns a string using the default p behaviour method if both toString and valueOf are overridden but both return non-primitive ${nonPrimitive}`, () => {
                const array = ['any', 'value'];
                array.toString = () => nonPrimitive;
                array.valueOf = () => nonPrimitive;

                const actual = p`Lots of hoops to implement this. ${array}`;

                expect(actual)
                    .toEqual('Lots of hoops to implement this. ["any","value"]');
            });
        });
    });
});
