import { Pool } from "node-postgres";
// const Pool = nodepostgres.Pool;
require("dotenv").config();
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT as string) || 5432,
});

const getAccount = (request: any, response: any) => {
  pool.query("SELECT * FROM StakeAccount", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
const createAccount = (request: any, response: any) => {
  const { owner, stakePool, voterWeightRecord, bondedShares, unbondingShares } =
    request.body;

  pool.query(
    `INSERT INTO StakeAccount (owner, stakePool,voterWeight,bondedShares,unbondingShares) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [owner, stakePool, voterWeightRecord, bondedShares, unbondingShares],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Account added with ID: ${results.rows[0].id}`);
    }
  );
};

const updateAccount = (request: any, response: any) => {
  const id = parseInt(request.params.id);
  const { owner, stakePool, voterWeightRecord, bondedShares, unbondingShares } =
    request.body;

  pool.query(
    "UPDATE StakeAccount SET owner = $1, stakePool = $2, voterWeight = $3, bondedShares = $4, unbondingShares = $5 WHERE id = $6",
    [owner, stakePool, voterWeightRecord, bondedShares, unbondingShares, id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`Account modified with ID: ${id}`);
    }
  );
};

const deleteAccount = (request: any, response: any) => {
  const id = parseInt(request.params.id);

  pool.query(
    "DELETE FROM StakeAccount WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`);
    }
  );
};
const getAccountById = (request: any, response: any) => {
  const id = parseInt(request.params.id);

  pool.query(
    "SELECT * FROM StakeAccount WHERE id = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
const connectToDB = async () => {
  try {
    await pool.connect();
  } catch (err) {
    console.log(err);
  }
};
export {
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountById,
  connectToDB,
};
