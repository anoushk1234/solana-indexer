import Queue from "bee-queue"
import assert from 'assert'
import conn from "./listener";
import { SystemInstruction, SystemProgram } from "@solana/web3.js";
import { BorshCoder, SystemCoder } from "@project-serum/anchor";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

const queue = new Queue('getBlock');


// Process jobs from as many servers or processes as you like
queue.process(async function (job: any, done: any) {
    let slot = job.data.slot;
    assert(slot, 'missing slot')
    console.log(`Processing slot: ${slot}--------------------------`);

    let block = await conn.getBlock(slot)
    if (!block) return
    let txs = block.transactions

    for (let tx of txs) {
        let message = tx.transaction.message
        let system_ixs = message.instructions.filter(ix => message.accountKeys[ix.programIdIndex].equals(SystemProgram.programId))
        for (let ix of system_ixs) {
            let transaction_instruction = {
                data: bs58.decode(ix.data),
                keys: ix.accounts.map(i => ({ pubkey: message.accountKeys[i], isSigner: false, isWritable: false })),
                programId: message.accountKeys[ix.programIdIndex]
            }

            let type = SystemInstruction.decodeInstructionType(transaction_instruction)

            if (type === 'Transfer') {
                let decoded = SystemInstruction.decodeTransfer(transaction_instruction)
                console.log("SYSTEM TRANSFER: ", decoded.fromPubkey.toBase58(), decoded.toPubkey.toBase58(), decoded.lamports.toString())
            }

        }
    }
    return done(null, job.data);
});

export default queue;