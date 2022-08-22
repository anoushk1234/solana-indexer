"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Table = require("terminal-table");
var Status;
(function (Status) {
    Status["OK"] = "\u2705";
    Status["FAILING"] = "\u274C";
    Status["UNKNOWN"] = "\u26A0\uFE0F";
})(Status = exports.Status || (exports.Status = {}));
const chalk_1 = __importDefault(require("chalk"));
const logo_1 = __importDefault(require("./logo"));
function dashboard(programIDIndexed, accountNames, qtys, statuses) {
    var t = new Table({
        borderStyle: 2,
        horizontalLine: true,
        width: [0, "20%", "10%", "10%"],
        rightPadding: 0,
        leftPadding: 0,
    });
    console.log(chalk_1.default.greenBright((0, logo_1.default)()));
    // let screen = blessed.screen();
    console.log(chalk_1.default.grey("ProgramID Indexed:", chalk_1.default.yellow(programIDIndexed)));
    t.push(["Accounts", "Quantity", "latency", "status"]);
    for (let i = 0; i < accountNames.length; i++) {
        t.push([accountNames[i], qtys[i], "69ms", statuses[i]]);
    }
    t.attrRange({ row: [0, 1] }, {
        align: "center",
        color: "yellow",
        bg: "black",
    });
    t.attrRange({ column: [0, 1] }, {
        color: "red",
    });
    t.attrRange({
        row: [1],
        column: [1],
    }, {
        align: "center",
    });
    t.attrRange({
        row: [1, 2, 3],
        column: [3],
    }, {
    // align: "center",
    });
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
exports.default = dashboard;
