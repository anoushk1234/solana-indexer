"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAccountById = exports.deleteAccount = exports.updateAccount = exports.createAccount = exports.getAccount = void 0;
const node_postgres_1 = require("node-postgres");
// const Pool = nodepostgres.Pool;
const pool = new node_postgres_1.Pool({
    user: "anoushkkharangate",
    host: "localhost",
    database: "api",
    port: 5432,
});
const getAccount = (request, response) => {
    pool.query("SELECT * FROM StakeAccount", (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
exports.getAccount = getAccount;
const createAccount = (request, response) => {
    const { owner, stakePool, voterWeightRecord, bondedShares, unbondingShares } = request.body;
    pool.query(`INSERT INTO StakeAccount (owner, stakePool,voterWeight,bondedShares,unbondingShares) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [owner, stakePool, voterWeightRecord, bondedShares, unbondingShares], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(201).send(`Account added with ID: ${results.rows[0].id}`);
    });
};
exports.createAccount = createAccount;
const updateAccount = (request, response) => {
    const id = parseInt(request.params.id);
    const { owner, stakePool, voterWeightRecord, bondedShares, unbondingShares } = request.body;
    pool.query("UPDATE StakeAccount SET owner = $1, stakePool = $2, voterWeight = $3, bondedShares = $4, unbondingShares = $5 WHERE id = $6", [owner, stakePool, voterWeightRecord, bondedShares, unbondingShares, id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`Account modified with ID: ${id}`);
    });
};
exports.updateAccount = updateAccount;
const deleteAccount = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query("DELETE FROM StakeAccount WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).send(`User deleted with ID: ${id}`);
    });
};
exports.deleteAccount = deleteAccount;
const getAccountById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query("SELECT * FROM StakeAccount WHERE id = $1", [id], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
exports.getAccountById = getAccountById;
