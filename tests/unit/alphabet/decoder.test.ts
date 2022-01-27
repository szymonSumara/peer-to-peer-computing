import Alphabet from "../../../alphabet/alphabet";
import Decoder from "../../../alphabet/decoder";

describe('Decoder', () => {

    const alphabet : Alphabet = new Alphabet();
    const decoder : Decoder  = new Decoder(alphabet);

    describe('decode', () => {
        it('should return empty string if number is negative', () => {
            expect( decoder.decode(-1)).toBe("");
            expect( decoder.decode(-1000)).toBe("");
        })

        it('other cases', () => {
            expect( decoder.decode(0)).toBe("q");
            expect( decoder.decode(23)).toBe("b");
            expect( decoder.decode(100)).toBe("qD");
            expect( decoder.decode(1000)).toBe("ho");
        })

    })



})