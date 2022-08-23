import { clusterApiUrl, Connection, Context, Logs, PublicKey, SystemProgram } from "@solana/web3.js";
import queue from "./queue";

let conn = new Connection(clusterApiUrl("mainnet-beta"));

let programToIndex = new PublicKey("11111111111111111111111111111111")

conn.onLogs(programToIndex, (logs: Logs, ctx: Context) => {
    let job = queue.createJob({ signature: logs.signature })
    job.save()
})

export default conn