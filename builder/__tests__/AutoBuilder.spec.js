import forAll from '../../data-driven';
import { recordError } from '../../record';
import AutoBuilder from '../AutoBuilder';

describe('AutoBuilder', () => {
    describe('basic behaviour', () => {
        it('should build provided properties', () => {
            const props = {
                prop1: 1337,
                prop2: 'dummy-value',
            };

            const sut = new AutoBuilder(props);
            const actual = sut.build();

            expect(actual).toEqual(props);
        });

        forAll([undefined, null, '', true, 1337, [], {}], (props) => {
            it(`should throw if initalProps are ${JSON.stringify(props)}`, () => {
                const actual = recordError(() => new AutoBuilder(props));

                expect(actual).toBeInstanceOf(TypeError);
            });
        });

        it('should create a with method for each provided key without underscores and proper camelCasing', () => {
            const props = {
                _prop1: 1337,
                prop2: 'leet',
            };

            const sut = new AutoBuilder(props);
            sut.withProp1(9001).withProp2('over nine thousand!');
            const actual = sut.build();

            expect(actual).toEqual({
                prop1: 9001,
                prop2: 'over nine thousand!',
            });
        });

        it('should create a without method for each provided key wihtout underscores and proper camelCasing', () => {
            const props = {
                _prop1: 1337,
                prop2: 'leet',
                prop3: 'oh yeah!',
            };

            const sut = new AutoBuilder(props);
            sut.withoutProp1().withoutProp2();
            const actual = sut.build();

            expect(Object.keys(actual)).toEqual([
                'prop3',
            ]);
        });
    });
});
