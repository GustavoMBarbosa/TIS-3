import express from "express";
import * as lucroController from "../controller/lucroController.js";

const router = express.Router();

router.post('/list', lucroController.listarLucro);
router.get('/:id', lucroController.getLucro);
router.post('/', lucroController.createLucro);
router.put('/:id', lucroController.updateLucro);
router.delete('/:id', lucroController.deleteLucro);

export default router;