import express from "express";
import * as financeController from "../controller/financeController.js";

const router = express.Router();

router.post("/", financeController.generateReport);

export default router;