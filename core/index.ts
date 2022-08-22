import { Idl } from "@project-serum/anchor";
import chalk from "chalk";
import fs from "fs";
import logo from "./logo";
import dashboard, { Status } from "./dashboard";
import { AccountParser } from "./AccountDecoder";
const main = async () => {
  const config = fs.readFileSync("./config.json", "utf8");
  const { programId, idlPath } = JSON.parse(config);
  const idl = JSON.parse(fs.readFileSync(idlPath, "utf8"));
  console.clear();
  // console.log(idl);

  !programId &&
    console.log(chalk.redBright("No programId found in config.json"));
  !idl && console.log(chalk.redBright("No idl path found in config.json"));

  const parser = new AccountParser(
    idl as Idl,
    programId,
    "mainnet-beta",
    "https://solana-mainnet.g.alchemy.com/v2/5bAylzadVLcGVcaM7j0qBTo3_ycH6Zrc"
  );

  let qtys: any[] = [];
  let statuses: Status[] = [];
  let final = await Promise.all(
    parser.accountNames
      .slice(0, parser.accountNames.length)
      .map(async (accountName) => {
        let data = await parser.getParsedAccounts(accountName);
        let [parsedAccounts, accountQty] = data;
        qtys.push(accountQty);
        statuses.push(
          parsedAccounts && parsedAccounts.length > 0
            ? parsedAccounts.length < accountQty
              ? Status.UNKNOWN
              : Status.OK
            : Status.FAILING
        );
        // console.log(accounts);
        return parsedAccounts;
      })
  );
  // console.log(chalk.greenBright(qtys));
  fs.writeFileSync("output.json", JSON.stringify(final));
  programId && dashboard(programId, parser.accountNames, qtys, statuses);
};
main();
