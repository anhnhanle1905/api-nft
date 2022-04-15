import cookieParser from "cookie-parser";
import express from "express";
import bodyParser from "body-parser";
// const pool = require("./src/db/...");

const port = process.env.PORT || 3000;

//xu ly form-data
// const multer = require("multer");
// const upload = multer();

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(upload.array());
import example from "./src/routers/nfts.routers.js";
import mint from "./src/routers/nfts.routers.js";

// app.use("/example", MIDDLEWARE, example);
app.use("/ok", example);
app.use("/", mint);
//db connect()
app.listen(port, () => console.log(`NFT API listening on port ${port}!`));
