import "dotenv/config";
import express from "express";
import bootstrap from "./src/utils/bootstrap.js";

const app = express();

bootstrap(app, express);
