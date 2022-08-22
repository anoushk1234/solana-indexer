"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const dashboard_1 = __importStar(require("./dashboard"));
const AccountDecoder_1 = require("./AccountDecoder");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = fs_1.default.readFileSync("./config.json", "utf8");
    const { programId, idlPath } = JSON.parse(config);
    const idl = JSON.parse(fs_1.default.readFileSync(idlPath, "utf8"));
    console.clear();
    // console.log(idl);
    !programId &&
        console.log(chalk_1.default.redBright("No programId found in config.json"));
    !idl && console.log(chalk_1.default.redBright("No idl path found in config.json"));
    const parser = new AccountDecoder_1.AccountParser(idl, programId, "mainnet-beta", "https://solana-mainnet.g.alchemy.com/v2/5bAylzadVLcGVcaM7j0qBTo3_ycH6Zrc");
    let qtys = [];
    let statuses = [];
    let final = yield Promise.all(parser.accountNames
        .slice(0, parser.accountNames.length)
        .map((accountName) => __awaiter(void 0, void 0, void 0, function* () {
        let data = yield parser.getParsedAccounts(accountName);
        let [parsedAccounts, accountQty] = data;
        qtys.push(accountQty);
        statuses.push(parsedAccounts && parsedAccounts.length > 0
            ? parsedAccounts.length < accountQty
                ? dashboard_1.Status.UNKNOWN
                : dashboard_1.Status.OK
            : dashboard_1.Status.FAILING);
        // console.log(accounts);
        return parsedAccounts;
    })));
    // console.log(chalk.greenBright(qtys));
    fs_1.default.writeFileSync("output.json", JSON.stringify(final));
    programId && (0, dashboard_1.default)(programId, parser.accountNames, qtys, statuses);
});
main();
