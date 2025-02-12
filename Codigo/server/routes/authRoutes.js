import express from "express";
import * as authController from "../controller/authController.js";

const router = express.Router();

router.get("/:authId", authController.getUser);
router.patch("/update-user/:authId", authController.updateUser);
router.delete("/delete-user/:authId", authController.deleteUser);

export default router;

