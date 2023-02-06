const utils = require('./utils');
const expect = require('expect');

describe('Utils', () => {
    describe('#add', () => {
        it('Should add two numbers', () => {
            const expected = 10 + 30;
            const res = utils.add(10, 30);

            if(res !== expected) {
                throw new Error(`Expected ${expected}, but got ${res}!`);
            }
        });
    });

    it('Should equal object properties', () => {
        const a = { name: 'Daniele', lastName: 'Bortolotti'};
        const b = { name: 'Daniele', lastName: 'Bortolotti' };
        
        // not same obj
        // expect(a).toBe(b);
        expect(a).toEqual(b);
        expect(a).toInclude({ lastName: 'Bortolotti' });
    });

    it('Should square a number', () => {
        const num = Math.random();
        const expected = Math.pow(num, 2);
        const res = utils.square(num);

        expect(res)
            .toBeA('number')
            .toBe(expected);
    });

    it('Shoul async add two numbers', (done) => {
        const a = Math.random();
        const b = Math.random();
        utils.asyncAdd(a, b, (sum) => {
            expect(sum)
                .toBe(a + b);
            done();
        });
    });
});