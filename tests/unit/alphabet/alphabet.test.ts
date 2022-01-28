import Alphabet from "../../../src/alphabet/alphabet";

describe('Alphabet', () => {

    const alphabet = new Alphabet();

    describe('letterFromInt', () => {
        it('should return RangeError if number is negative', () => {
            expect( () => alphabet.letterFromInt(-1)).toThrow(RangeError);
        })

        it('should return RangeError if number is equal to alphabet length or is higher', () => {
            expect(() => alphabet.letterFromInt(alphabet.length)).toThrow(RangeError);
            expect(() => alphabet.letterFromInt(alphabet.length + 1)).toThrow(RangeError);
        })
    })
})


