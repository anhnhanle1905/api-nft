import express from "express";
const router = express.Router();

import { mint } from "../controller/nfts.controller.js";

router.post("/mint", mint);

export default router;
