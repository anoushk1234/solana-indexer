import { BorshCoder, Idl } from "@project-serum/anchor";
import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
export type Cluster = "devnet" | "testnet" | "mainnet-beta";

export class AccountParser {
  readonly idl: Idl;
  readonly programId: string;
  public accounts: string[];
  readonly connection: Connection;
  parsedAccounts: any[];
  accountQty: number;
  constructor(
    idl: Idl,
    programId: string,
    network: Cluster,
    endpoint?: string
  ) {
    this.idl = idl;
    this.programId = programId;
    this.accounts = idl.accounts?.map((account) => account.name) || [];
    this.connection = new Connection(
      endpoint || clusterApiUrl(network || "mainnet-beta")
    );
    this.parsedAccounts = [];
    this.accountQty = 0;
  }
  public async getParsedAccounts(accountName: string): Promise<any[]> {
    let coder = new BorshCoder(this.idl);

    let fetchedAccounts = await this.connection.getProgramAccounts(
      new PublicKey(this.programId)
    );

    // console.log(fetchedAccounts);
    fetchedAccounts.map((account) => {
      try {
        this.parsedAccounts.push({
          pubkey: account.pubkey.toString(),
          ...coder.accounts.decode(accountName, account.account.data),
        });
        this.accountQty++;
      } catch (e) {}
    });
    return [this.parsedAccounts, this.accountQty];
  }
  get accountNames(): string[] {
    return this.accounts;
  }
}
