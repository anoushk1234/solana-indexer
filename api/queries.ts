import fs from "fs";
import { Idl } from "@project-serum/anchor";
require("dotenv").config();

const config = fs.readFileSync("./config.json", "utf8");
const { programId, idlPath } = JSON.parse(config);
const idl = JSON.parse(fs.readFileSync(idlPath, "utf8")) as Idl;
enum AnchorTypes {
  bool = "bool",
  u8 = "u8",
  i8 = "i8",
  u16 = "u16",
  i16 = "i16",
  u32 = "u32",
  i32 = "i32",
  f32 = "f32",
  u64 = "u64",
  i64 = "i64",
  f64 = "f64",
  u128 = "u128",
  i128 = "i128",
  bytes = "bytes",
  string = "string",
  publicKey = "publicKey",
  IdlTypeDefined = "IdlTypeDefined",
  IdlTypeOption = "IdlTypeOption",
  IdlTypeCOption = "IdlTypeCOption",
  IdlTypeVec = "IdlTypeVec",
  IdlTypeArray = "IdlTypeArray",
}

export {};
