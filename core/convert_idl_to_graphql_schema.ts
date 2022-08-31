import { BN, BorshCoder, Idl } from "@project-serum/anchor"
import fs from "fs"
import assert from 'assert'
import { buildASTSchema, parse, DocumentNode, GraphQLSchema, buildSchema, print, printSchema, Kind, DefinitionNode, FieldDefinitionNode, EnumTypeDefinitionNode, InputValueDefinitionNode, NameNode } from "graphql";
import { IdlAccountDef, IdlField, IdlTypeDef, IdlTypeDefStruct, IdlType } from "@project-serum/anchor/dist/cjs/idl";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import { Connection, PublicKey } from "@solana/web3.js";
let node = "https://billowing-frosty-butterfly.solana-mainnet.discover.quiknode.pro/3ea0ae51e25fd0ae45034cef8abc4f8bbac30a32/"
let conn = new Connection(node);
const idl = JSON.parse(fs.readFileSync("core/candymachine_idl.json", "utf8")) as Idl;

assert(idl.accounts, 'accounts can not be null')

function convertToPrismaTypes(obj: Object) {
    let final: any = {}
    if (obj == null) return null

    for (let [key, value] of Object.entries(obj)) {
        if (value instanceof PublicKey) {
            final[key] = value.toString()
        } else if (value instanceof BN) {
            final[key] = value.toString()
        } else if (typeof value === 'object' &&
            !Array.isArray(value)) {
            final[key] = convertToPrismaTypes(value)
        }
        else {
            final[key] = value
        }
    }
    return final
}

function createFieldDefinitionNode(field: IdlField) {
    // @ts-ignore
    let _type = field.type.option || field.type

    switch (_type) {
        case "publicKey":
        case "string":
        case "u64":
        case "i64":
        case "u16":
        case "u8":
            return {
                kind: Kind.FIELD_DEFINITION,
                name: {
                    kind: Kind.NAME,
                    value: field.name
                },
                type: {
                    kind: Kind.NAMED_TYPE,
                    name: {
                        kind: Kind.NAME,
                        value: 'String'
                    }
                }
            } as FieldDefinitionNode
        case "bool":
            return {
                kind: Kind.FIELD_DEFINITION,
                name: {
                    kind: Kind.NAME,
                    value: field.name
                },
                type: {
                    kind: Kind.NAMED_TYPE,
                    name: {
                        kind: Kind.NAME,
                        value: 'Boolean'
                    }
                }
            } as FieldDefinitionNode
    }

    if (_type.defined) {
        return {
            kind: Kind.FIELD_DEFINITION,
            name: {
                kind: Kind.NAME,
                value: field.name
            },
            type: {
                kind: Kind.NAMED_TYPE,
                name: {
                    kind: Kind.NAME,
                    value: _type.defined
                }
            }
        } as FieldDefinitionNode
    }

    if (_type.vec) {
        return {
            kind: Kind.FIELD_DEFINITION,
            name: {
                kind: Kind.NAME,
                value: field.name
            },
            type: {
                kind: Kind.LIST_TYPE,
                type: {
                    kind: Kind.NAMED_TYPE,
                    name: {
                        kind: Kind.NAME,
                        // value: 'String' // todo: recursion
                        value: _type.vec.defined // todo: recursion
                    }
                }
            }
        } as FieldDefinitionNode
    }

    console.log(_type, "not implemented")

}


function createFieldDefinitionNodesForAccount(account: IdlAccountDef | IdlTypeDef) {
    let fields: FieldDefinitionNode[] = []

    if (account.type.kind !== 'struct') {
        console.log(account.type.kind, "as not implemented")
        return fields
    }

    for (let field of account.type.fields) {
        let node = createFieldDefinitionNode(field)
        if (node) fields.push(node)
    }
    return fields
}


let definitionNodes: DefinitionNode[] = []

// ACCOUNTS
for (let account of idl.accounts || []) {
    let definition: DefinitionNode = {
        kind: Kind.OBJECT_TYPE_DEFINITION,
        name: {
            kind: Kind.NAME,
            value: account.name,
        },
        fields: createFieldDefinitionNodesForAccount(account)
    }

    definitionNodes.push(definition)
}

// TYPES
for (let _type of idl.types || []) {
    if (_type.type.kind === "enum") {
        let definition: DefinitionNode = {
            kind: Kind.ENUM_TYPE_DEFINITION,
            name: {
                kind: Kind.NAME,
                value: _type.name,
            },
            values: _type.type.variants.map(v => ({
                kind: Kind.ENUM_VALUE_DEFINITION,
                name: {
                    kind: Kind.NAME,
                    value: v.name
                }
            }))
        }
        definitionNodes.push(definition)
    } else {
        let definition: DefinitionNode = {
            kind: Kind.OBJECT_TYPE_DEFINITION,
            name: {
                kind: Kind.NAME,
                value: _type.name,
            },
            fields: createFieldDefinitionNodesForAccount(_type)
        }

        definitionNodes.push(definition)
    }
}

let accounts = idl.accounts || []

// MAIN TOP LEVEL QUERY
let queries: any = accounts.map(acc => ({
    kind: Kind.FIELD_DEFINITION,
    name: {
        kind: Kind.NAME,
        value: acc.name + "Account"
    } as NameNode,
    arguments: [
        {
            kind: Kind.INPUT_VALUE_DEFINITION,
            name: {
                kind: Kind.NAME,
                value: "address"
            },
            type: {
                kind: Kind.NAMED_TYPE,
                name: {
                    kind: Kind.NAME,
                    value: "String"
                }
            }
        } as InputValueDefinitionNode
    ],
    type: {
        kind: Kind.NAMED_TYPE,
        name: {
            kind: Kind.NAME,
            value: acc.name
        }
    }
}))

let definition: DefinitionNode = {
    kind: Kind.OBJECT_TYPE_DEFINITION,
    name: {
        kind: Kind.NAME,
        value: "Query"
    },
    fields: queries
}

definitionNodes.push(definition)

let AST: DocumentNode = {
    kind: Kind.DOCUMENT,
    definitions: definitionNodes
}

let schema = buildASTSchema(AST, { assumeValid: false })
console.log(printSchema(schema))

let resolvers: any = {}
idl.accounts.map(acc => {
    resolvers[acc.name + "Account"] = async (context: any) => {
        console.log("fetching", context.address)
        let coder = new BorshCoder(idl as Idl)
        let x = await conn.getAccountInfo(new PublicKey(context.address))
        let decodedAccount = coder.accounts.decode(acc.name, x!.data)
        return convertToPrismaTypes(decodedAccount)
    }
})

const app = express();
app.use('/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: true,
}));
app.listen(5000);
console.log('Running a GraphQL API server at http://localhost:5000/graphql');