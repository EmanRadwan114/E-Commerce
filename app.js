process.on("uncaughtException", (err) =>
  console.log(`programming error ${err}`)
);

import "dotenv/config";
import express from "express";
import bootstrap from "./src/utils/bootstrap.js";
import "./Database/dbConnection.js";

const app = express();

bootstrap(app, express);
