import express from "express";
import * as despesasController from "../controller/despesasController.js";

const router = express.Router();

router.post("/list", despesasController.listarDespesas);
/**
 * @swagger
 * tags:
 *   - name: Despesas
 *     description: Gerenciamento de despesas
 */

/**
 * @swagger
 * /despesas/{id}:
 *   get:
 *     summary: Retorna uma despesa específica pelo seu id
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da despesa específica
 *     responses:
 *       200:
 *         description: Despesa encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Despesa'
 *       404:
 *         description: Despesa não encontrada
 */
router.get("/:id", despesasController.getDespesaById);

/**
 * @swagger
 * /despesas:
 *   post:
 *     summary: Cria uma nova despesa
 *     tags: [Despesas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Despesa'
 *     responses:
 *       201:
 *         description: Despesa criada com sucesso
 *       400:
 *         description: Erro na requisição
 */
router.post("/", despesasController.createNewDespesa);

/**
 * @swagger
 * /despesas/{id}:
 *   put:
 *     summary: Atualiza uma despesa específica pelo seu id
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true 
 *         schema:
 *           type: string
 *         description: Id da despesa específica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Despesa'
 *     responses:
 *       200:
 *         description: Despesa atualizada com sucesso
 *       404:
 *         description: Despesa não encontrada
 */
router.put("/:id", despesasController.updateDespesaById);

/**
 * @swagger
 * /despesas/{id}:
 *   delete:
 *     summary: Deleta uma despesa específica pelo seu id
 *     tags: [Despesas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Id da despesa específica
 *     responses:
 *       200:
 *         description: Despesa deletada com sucesso
 *       404:
 *         description: Despesa não encontrada
 */
router.delete("/:id", despesasController.deleteDespesaById);

export default router;