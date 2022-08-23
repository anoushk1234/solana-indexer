import Queue from "bee-queue"
import assert from 'assert'
import conn from "./listener";

const queue = new Queue('getBlock');

// Process jobs from as many servers or processes as you like
queue.process(async function (job: any, done: any) {
    let signature = job.data.signature;
    assert(signature, 'missing signature')

    console.log(`Processing job: ${signature}`);
    let tx = await conn.getParsedTransaction(signature)
    // @ts-ignore
    console.log(tx?.transaction.message.instructions.map(ix => [ix.parsed.info.source, ix.parsed.info.destination, ix.parsed.info.lamports]))
    return done(null, job.data);
});

export default queue;