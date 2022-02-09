import {WorkBlock} from "../../../src/work";

describe('WorkBlock', () => {
     it('Test for block number 0', () => {
        const workBlock = new WorkBlock(0);
        expect(workBlock.getNext()).toBe("q");
        expect(workBlock.getNext()).toBe("w");

        let work;
        while (!workBlock.isFinish()) work = workBlock.getNext();
        expect(work).toBe("0000")

    })

    it('other cases', () => {
        const workBlock = new WorkBlock(101);
        expect(workBlock.getNext()).toBe("qDqqqq");
        expect(workBlock.getNext()).toBe("qDqqqw");

        let work;
        while (!workBlock.isFinish()) work = workBlock.getNext();
        expect(work).toBe("qD0000")
    })
})