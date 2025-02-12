import express from "express";
import * as gestacaoController from "../controller/gestacaoController.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: Gestacao
 *    description: Rotas para realizar operaçes na tabela de gestaçoes
 */

/**
 * @swagger
 * /gestacao/{id}:
 *  get:
 *   summary: Retorna as informações daquela gestação específica
 *   tags: [Gestacao]
 *   parameters: 
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *          type: string
 *      description: id da gestação específica
 *   responses:
 *      200:
 *          description: Gestacao encontrada
 *          content: 
 *              application/json:
 *               schema: 
 *                  $ref: '#components/schemas/Gestacao'
 */
router.get("/:animal_id", gestacaoController.getGestacaoById);

/**
 * @swagger
 * /gestacao/:
 *   post:
 *     summary: Cria uma gestação
 *     tags: [Gestacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Gestacao'
 *     responses:
 *       201:
 *         description: Gestação criada
 */

router.post("/", gestacaoController.createGestacao);

/**
 * @swagger
 * /gestacao/{id}:
 *  put:
 *   summary: Atualiza as a gestacão específica
 *   tags: [Gestacao]
 *   parameters: 
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *          type: id
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#components/schemas/Gestacao'
 *   responses:
 *      200:
 *          description: Gestacao encontrada
 *          content: 
 *              application/json:
 *               schema: 
 *                  $ref: '#components/schemas/Gestacao'
 */
router.put("/:id", gestacaoController.updateGestacao);

/**
 * @swagger
 * /gestacao/{id}:
 *  put:
 *   summary: Realiza o parto de um animal e atualiza o número de crias
 *   tags: [Gestacao]
 *   parameters: 
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *          type: id
 *      description: id da gestação específica
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       type: int
 *       description: nmero de crias
 *   responses:
 *      200:
 *          description: Gestacao encontrada
 *          content: 
 *              application/json:
 *               schema: 
 *                  $ref: '#components/schemas/Gestacao'
 */
router.put('/parir/:id', gestacaoController.parirAnimal);

/**
 * @swagger
 * /gestacao/{animal_id}:
 *  delete:
 *   summary: Deleta uma gestação
 *   tags: [Gestacao]
 *   parameters: 
 *    - in: path
 *      name: animal_id
 *      required: true
 *      schema:
 *          type: string
 *      description: id do animal específico
 *  responses:
 *      200:
 *          description: Gestacao deletada
 */
router.delete("/:nome_animal", gestacaoController.deleteGestacao);

export default router;
