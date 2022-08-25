import fs from "fs";
enum AnchorTypes {
  bool = "Boolean",
  u8 = "Int",
  i8 = "Int",
  u16 = "Int",
  i16 = "Int",
  u32 = "Int",
  i32 = "Int",
  f32 = "Float",
  u64 = "Int",
  i64 = "Int",
  f64 = "Float",
  u128 = "BigInt",
  i128 = "BigInt",
  bytes = "Bytes",
  string = "String",
  publicKey = "String",
  IdlTypeDefined = "IdlTypeDefined",
  IdlTypeOption = "IdlTypeOption",
  IdlTypeCOption = "IdlTypeCOption",
  IdlTypeVec = "[]",
  IdlTypeArray = "[]",
}
let idlSchema = {
  accounts: [
    {
      name: "EventAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "title",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "link",
            type: "string",
          },
          {
            name: "fee",
            type: "u64",
          },
          {
            name: "seats",
            type: "u64",
          },
          {
            name: "occupiedSeats",
            type: "u64",
          },
          {
            name: "date",
            type: "string",
          },
          {
            name: "collection",
            type: "publicKey",
          },
          {
            name: "venue",
            type: "string",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "creators",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "eventHost",
            type: {
              defined: "EventHost",
            },
          },
          {
            name: "eventNonce",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "isCutPayedByCreator",
            type: "bool",
          },
          {
            name: "isCustomSplToken",
            type: "bool",
          },
          {
            name: "customSplToken",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "EventHostAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "eventHostStruct",
            type: {
              defined: "EventHost",
            },
          },
        ],
      },
    },
    {
      name: "AdminAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "admins",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "bump",
            type: "u8",
          },
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "verifiedPartners",
            type: {
              vec: "publicKey",
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "EventHost",
      type: {
        kind: "struct",
        fields: [
          {
            name: "eventsCreated",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "displayName",
            type: "string",
          },
          {
            name: "pubKey",
            type: "publicKey",
          },
          {
            name: "profileImage",
            type: "string",
          },
          {
            name: "eventCount",
            type: "u64",
          },
          {
            name: "bump",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "CreateEventInput",
      type: {
        kind: "struct",
        fields: [
          {
            name: "title",
            type: "string",
          },
          {
            name: "description",
            type: "string",
          },
          {
            name: "uri",
            type: "string",
          },
          {
            name: "link",
            type: "string",
          },
          {
            name: "fee",
            type: "u64",
          },
          {
            name: "seats",
            type: "u64",
          },
          {
            name: "date",
            type: "string",
          },
          {
            name: "venue",
            type: "string",
          },
          {
            name: "isCutPayedByCreator",
            type: "bool",
          },
          {
            name: "isCustomSplToken",
            type: "bool",
          },
          {
            name: "customSplToken",
            type: "publicKey",
          },
        ],
      },
    },
  ],
};

Object.keys(idlSchema).map((key) => {
  let prismaschema = "";
  try {
    if (key === "accounts") {
      const types = idlSchema.accounts;
      for (let i in types) {
        let data;
        const type = types[i];
        console.log(type.name.includes("Input"), type.name);
        if (type.name.toLowerCase().includes("input")) continue; // just for custom input structs
        if (type.type.kind === "enum") {
          data = `
      enum ${type.name}{
          ${
            //@ts-ignore
            type?.type?.variants?.map((v) => v.name).join("\n")
          }
          }
      `;
        } else if (type.type.kind === "struct") {
          data = `
      model ${type.name}{
          ${type?.type?.fields
            ?.map((f: any, i) => {
              console.log(f.type);
              let field = "";
              if (i === 0) {
                field = "pubkey String @id \n";
              }
              try {
                if (Object.keys(f.type).includes("vec")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string
                      : typeof f.type.vec === "string"
                      ? AnchorTypes.publicKey
                      : f.type.vec.defined;
                  if (f.type.vec.defined) {
                    field += f.name.concat(
                      ` ${typefield}[] \n ${f.name}Id String`
                    );
                  } else {
                    field += f.name.concat(` ${typefield}[]`);
                  }
                  console.log(field, "field");
                } else if (Object.keys(f.type).includes("defined")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string
                      : f.type.defined;
                  if (f.type.defined) {
                    field += f.name.concat(
                      ` ${typefield} \n ${f.name}Id String`
                    );
                    console.log("this", field);
                  } else {
                    field += f.name.concat(` ${typefield}`);
                  }
                } else {
                  let typefield: AnchorTypes | string | null =
                    typeof f.type == "string" ? AnchorTypes.string : null;
                  field += f.name.concat(` ${typefield}`);
                }
              } finally {
                console.log("f2", field);
                return field;
              }
            })
            .join("\n")}
      }
      `;
        }

        if (data) prismaschema += data;
      }
    } else if (key === "types") {
      const types = idlSchema.types;
      for (let i in types) {
        let data;
        const type = types[i];
        console.log(type.name.includes("Input"), type.name);
        if (type.name.toLowerCase().includes("input")) continue; // just for custom input structs
        if (type.type.kind === "enum") {
          data = `
      enum ${type.name}{
          ${
            //@ts-ignore
            type?.type?.variants?.map((v) => v.name).join("\n")
          }
          }
      `;
        } else if (type.type.kind === "struct") {
          data = `
      model ${type.name}{
          ${type?.type?.fields
            ?.map((f: any, i) => {
              console.log(f.type);
              let field = "";

              try {
                if (Object.keys(f.type).includes("vec")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string
                      : typeof f.type.vec === "string"
                      ? AnchorTypes.publicKey
                      : f.type.vec.defined;
                  if (f.type.vec.defined) {
                    field += f.name.concat(
                      ` ${typefield}[] \n ${f.name}Id String`
                    );
                    console.log("this", field);
                  } else {
                    field += f.name.concat(` ${typefield}[]`);
                  }
                  console.log(field, "field");
                } else if (Object.keys(f.type).includes("defined")) {
                  let typefield: AnchorTypes | string =
                    typeof f.type == "string"
                      ? AnchorTypes.string
                      : f.type.defined;
                  if (f.type.defined) {
                    field += f.name.concat(
                      ` ${typefield} \n ${f.name}Id String`
                    );
                  } else {
                    field += f.name.concat(` ${typefield}`);
                  }
                } else {
                  let typefield: AnchorTypes | string | null =
                    typeof f.type == "string" ? AnchorTypes.string : null;
                  field += f.name.concat(` ${typefield}`);
                }
                if (i === 0) {
                  field.toLowerCase().includes("pub");
                }
              } finally {
                console.log("f2", field);
                return field;
              }
            })
            .join("\n")}
      }
      `;
        }

        if (data) prismaschema += data;
      }
    }
  } finally {
    fs.appendFileSync("./schema.prisma", prismaschema);
  }
});
