
export default class Alphabet {
    private static letters : string = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";

    letterFromInt( number : number ) {
        if (Alphabet.letters.length <= number || number < 0)
            throw new RangeError(`Invalid letter number(${number})`);
        return Alphabet.letters[number];
    }

    get length(){
        return Alphabet.letters.length;
    }
}


