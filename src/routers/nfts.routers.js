import express from "express";
const router = express.Router();

import { mint, transferNft } from "../controller/nfts.controller.js";

router.post("/mint", mint);
router.post("/transfer", transferNft);

export default router;
