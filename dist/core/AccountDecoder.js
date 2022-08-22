"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountParser = void 0;
const anchor_1 = require("@project-serum/anchor");
const web3_js_1 = require("@solana/web3.js");
class AccountParser {
    constructor(idl, programId, network, endpoint) {
        var _a;
        this.idl = idl;
        this.programId = programId;
        this.accounts = ((_a = idl.accounts) === null || _a === void 0 ? void 0 : _a.map((account) => account.name)) || [];
        this.connection = new web3_js_1.Connection(endpoint || (0, web3_js_1.clusterApiUrl)(network || "mainnet-beta"));
        this.parsedAccounts = [];
        this.accountQty = 0;
    }
    getParsedAccounts(accountName) {
        return __awaiter(this, void 0, void 0, function* () {
            let coder = new anchor_1.BorshCoder(this.idl);
            let fetchedAccounts = yield this.connection.getProgramAccounts(new web3_js_1.PublicKey(this.programId));
            fetchedAccounts.map((account) => {
                try {
                    this.parsedAccounts.push(coder.accounts.decode(accountName, account.account.data));
                }
                catch (e) { }
            });
            return [this.parsedAccounts, this.accountQty];
        });
    }
    get accountNames() {
        return this.accounts;
    }
}
exports.AccountParser = AccountParser;
