import {Alphabet, Decoder} from "../alphabet"

export class WorkBlock{

    private static workSize : number = 4;
    private iterator : number;
    private readonly end : number;
    public readonly prefix : string;
    private decoder : Decoder;
    private readonly alphabet : Alphabet;

    constructor( number : number) {

        this.alphabet = new Alphabet()
        this.decoder = new Decoder(this.alphabet);

        if(number === 0){
            this.prefix = "";
            this.iterator = 0;
        }else{
            number -= 1;
            this.prefix = this.decoder.decode(number);
            this.iterator = this.geometricSequenceSum(1, this.alphabet.length, WorkBlock.workSize) - 1;
        }
        this.end =  this.geometricSequenceSum(1, this.alphabet.length, WorkBlock.workSize + 1) - 1;
    }

    isFinish() : boolean {
        if(this.iterator === this.end) return true;
        return false;
    }

    getNext() : string {
        const workBody = this.decoder.decode(this.iterator);
        this.iterator+=1;
        return this.prefix + workBody;
    }

    private geometricSequenceSum( a1 : number, q : number, n : number) : number {
        return a1 * (1 - Math.pow(q, n)) / (1 - q)
    }
}