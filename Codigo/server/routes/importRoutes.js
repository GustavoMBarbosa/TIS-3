import express from 'express';
import * as importController from '../controller/importController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *  - name: import
 *    description: Rota genérica para importação de dados por planilhas csv
 */

/**
 * @swagger
 * /import/{tableName}:
 * post:
 *  summary: Insere os dados presentes na planilha no banco de dados
 *  tags: [Imports] 
 *  parameters: 
 *   - in: path
 *     name: tableName
 *     required: true
 *     schema: 
 *          $ref: '#/components/schema/Imports'
 *     description: nome da tabela onde os dados serão inseridos     
 */
router.post('/:tableName', importController.insertMultipleBasic);

export default router;

