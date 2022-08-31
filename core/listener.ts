import { clusterApiUrl, Connection, Context, Logs, PublicKey, SlotUpdate, SystemProgram } from "@solana/web3.js";
import queue from "./queue";

let node = "https://billowing-frosty-butterfly.solana-mainnet.discover.quiknode.pro/3ea0ae51e25fd0ae45034cef8abc4f8bbac30a32/"

let conn = new Connection(node);

let programToIndex = new PublicKey("11111111111111111111111111111111")

// conn.onSlotUpdate((slotUpdate: SlotUpdate) => {
//     let job = queue.createJob({ slot: slotUpdate.slot })
//     job.save()
// })

export default conn