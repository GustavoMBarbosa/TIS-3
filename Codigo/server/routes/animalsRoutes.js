import express from "express";
import * as animalsController from "../controller/animalsController.js";

const router = express.Router();

/**
 * @swagger
 * tags: 
 *   - name: Animais
 *     description: Rotas para realizar operações na tabela de animais
 * 
 * /animals/{id}:
 *   get:
 *     tags: 
 *       - Animais
 *     description: Retorna as informações pelo id do animal
 *     summary: Retorna as informações pelo id do animal
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: id do animal
 *         required: true
 *     responses:
 *       200:
 *         description: Retorna as informações do animal
 */
router.get("/:id", animalsController.getAnimalById);

/**
 * @swagger
 * /animals/:
 *  post:
 *   summary: Cria um novo animal
 *   tags: [Animais]
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Animal'
 *   responses:
 *    201:
 *     description: Animal criado
 *    404:
 *     description: Nome do animal já existe
 */
router.post("/", animalsController.createNewAnimal);

/**
 * @swagger
 * /animals/{id}:
 *  put:
 *   summary: Atualiza as informações daquele animal específico
 *   tags: [Animais]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      description: id do animal
 *      required: true
 *   requestBody:
 *    required: true
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/components/schemas/Animal'
 *   responses:
 *    200:
 *     description: Animal atualizado
 */
router.put("/:id", animalsController.updateAnimalById);

/**
 * @swagger
 * /animals/{id}:
 *  delete:
 *   summary: Deleta um animal
 *   tags: [Animais]
 *  parameters:
 *    - in: path
 *      name: id
 *      required: true
 *      schema:
 *       type: string
 *      description: id do animal
 *  responses:
 *   200:
 *    description: Animal deletado
 */
router.delete("/:id", animalsController.deleteAnimalById);

export default router;
