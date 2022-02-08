import  { workerData, parentPort } from 'worker_threads';
import crypto from  'crypto';
import WorkBlock from '../work/workBlock.js'
const workBlock = new WorkBlock(workerData.blockNumber)

console.log("Start Block " + workBlock.prefix);

if(parentPort === null) throw new RangeError();

while(!workBlock.isFinish()){
    const test = workBlock.getNext();
    const sha256Hasher = crypto.createHash("sha256");

    const testedHash = sha256Hasher.update(test).digest("hex");
    if(testedHash === workerData.hash)
        parentPort.postMessage({find:true, result:test});
}

parentPort.postMessage({find:false});