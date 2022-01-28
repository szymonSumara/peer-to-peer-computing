import Alphabet from "./alphabet";

export default class Decoder{

    private alphabet : Alphabet;

    constructor(alphabet : Alphabet){
        this.alphabet = alphabet;
    }

    decode(number : number){
        let result : string = "";

        while(number >= 0){
            result =  this.alphabet.letterFromInt( number% this.alphabet.length) + result;
            number = Math.floor(number / this.alphabet.length ) - 1;
        }

        return result;
    }
}