import {Alphabet, Decoder } from "../../../src/alphabet";
import {JobState} from "../../../src/job";

describe('JobState', () => {


    it('Should return incrementing block number', () => {
        const  state = new JobState();
        expect( state.next()).toBe(0);
        expect( state.next()).toBe(1);
        expect( state.next()).toBe(2);
    })

    it('Should add started work to taskInProgress arr', () => {
        const  state = new JobState();
        state.noteStart({
            processedBy:"test1",
            startTime: new Date(),
            blockNumber:12,
        });

        state.noteStart({
            processedBy:"test2",
            startTime: new Date(),
            blockNumber:20,
        });

        state.noteStart({
            processedBy:"test3",
            startTime: new Date(),
            blockNumber:60,
        });

        const blockInProgress = state.blockInProgress;
        const work1 = blockInProgress.find(work => work.blockNumber === 12);
        expect(work1?.processedBy).toBe("test1");
        const work2 = blockInProgress.find(work => work.blockNumber === 20);
        expect(work2?.processedBy).toBe("test2");
        const work3 = blockInProgress.find(work => work.blockNumber === 60);
        expect(work3?.processedBy).toBe("test3");
    });

    it('Should move task to taskQueue and next call function next() shuld return stopped work number', () => {
        const  state = new JobState();

        state.noteStart({
            processedBy:"test1",
            startTime: new Date(),
            blockNumber:12,
        });

        state.noteDisconnect("test1");
        expect(state.blockQueue).toEqual(
            expect.arrayContaining([12]),
        );

        expect(state.next()).toEqual(12 );

        expect(state.blockQueue).toEqual(
            expect.not.arrayContaining([12]),
        );
    });
})