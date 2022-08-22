import bodyParser from "body-parser";
import express from "express";

const app = express();
// var mongoose = require('mongoose');
const cors = require("cors");
import * as db from "./queries";
require("dotenv").config();

const PORT = process.env.PORT || 6000;

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(cors(corsOptions));
app.get("/", (req: any, res: any) => {
  res.send("hello");
});
db.connectToDB();
app.get("/users", db.getAccount);
app.get("/users/:id", db.getAccountById);
app.post("/users", db.createAccount);
app.put("/users/:id", db.updateAccount);
app.delete("/users/:id", db.deleteAccount);
app.listen(PORT, () => {
  console.log("App runn ing on port ", PORT);
});
