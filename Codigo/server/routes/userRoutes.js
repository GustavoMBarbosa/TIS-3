import express from 'express';
import *  as userController from '../controller/userController.js'

const router = express.Router();

router.get("/:email", userController.getUserByEmail)
router.get("/:token", userController.getUserByToken)
router.post("/", userController.createNewUser)
router.put("/:id", userController.updateUser)
router.delete("/:email", userController.deleteUser)

export default router;

