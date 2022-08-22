var Table = require("terminal-table");
export enum Status {
  OK = "✅",
  FAILING = "❌",
  UNKNOWN = "⚠️",
}
import chalk from "chalk";
import logo from "./logo";
export default function dashboard(
  programIDIndexed: string,
  accountNames: string[],
  qtys: number[],
  statuses: Status[]
) {
  var t = new Table({
    borderStyle: 2,
    horizontalLine: true,
    width: [0, "20%", "10%", "10%"],
    rightPadding: 0,
    leftPadding: 0,
  });
  console.log(chalk.greenBright(logo()));
  // let screen = blessed.screen();
  console.log(chalk.grey("ProgramID Indexed:", chalk.yellow(programIDIndexed)));

  t.push(["Accounts", "Quantity", "latency", "status"]);
  for (let i = 0; i < accountNames.length; i++) {
    t.push([accountNames[i], qtys[i], "69ms", statuses[i]]);
  }

  t.attrRange(
    { row: [0, 1] },
    {
      align: "center",
      color: "yellow",
      bg: "black",
    }
  );

  t.attrRange(
    { column: [0, 1] },
    {
      color: "red",
    }
  );

  t.attrRange(
    {
      row: [1],
      column: [1],
    },
    {
      align: "center",
    }
  );
  t.attrRange(
    {
      row: [1, 2, 3],
      column: [3],
    },
    {
      // align: "center",
    }
  );

  console.log("" + t);
  // canvas.write(logo()).flush();
  // canvas.write("" + t).saveScreen();
  // setTimeout(() => {
  //   console.clear();
  //   console.log(chalk.greenBright(logo()));
  //   t.cell(1, 2, "blah");
  //   console.log("" + t);
  // }, 5000);
}
