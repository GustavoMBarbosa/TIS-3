import express, { query } from "express";
import pool from "../db/index.js";
import { getAnimalById } from "./animalsServices.js";

const router = express.Router();

router.use(express.json());

/**
 * @param {number} animal_id - O ID do animal para recuperar os dados de gestação.
 * @returns {Promise<Gestacao>} Uma promessa que resolve para os dados de gestação do animal especificado.
 * Recupera um registro de gestação pelo ID do animal.
 */
async function getGestacaoById(animal_id) {
    const queryResult = await pool.query(
        "SELECT * FROM gestacao WHERE animal_id = $1",
        [animal_id]
    );
    return queryResult.rows[0];
}

/**
 * @param {number} animal_id - O ID do animal para recuperar os dados de gestação.
 * @returns {Promise<Gestacao>} Uma promessa que resolve para os dados de gestação do animal especificado.
 * Recupera todos os registros de gestação pelo ID do animal.
 */
async function getAllGestacoesByAnimalId(animal_id) {
    const queryResult = await pool.query(
        "SELECT * FROM gestacao WHERE animal_id = $1",
        [animal_id]
    );
    return queryResult.rows;
}

/**
 * @param {object} body - O corpo da requisição com os dados de gestação.
 * @returns {Promise<Gestacao>} Uma promessa que resolve para os dados de gestação do animal especificado.
 * Cria um novo registro de gestação.
 */
async function createGestacao(body) {
    const { animal_id, status, prev_parto, touro, data_insem, data_finalizacao } = body;
    const queryText = "INSERT INTO gestacao (animal_id, status, prev_parto, touro, data_insem, data_finalizacao) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
    const result = await pool.query(queryText, [animal_id, status, prev_parto, touro, data_insem, data_finalizacao]);
    return result.rows[0];
}

/**
 * @param {number} id - O ID do registro de gestação a ser atualizado.
 * @param {object} updates - O objeto com as atualizações a serem feitas no registro de gestação.
 * @returns {Promise<Gestacao>} Uma promessa que resolve para os dados de gestação do animal especificado.
 * Atualiza um registro de gestação existente.
 */
async function updateGestacao(id, updates) {
    const fields = Object.keys(updates)
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

    const values = Object.values(updates);
    const query = `UPDATE gestacao SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

/**
 * @param {number} id - O ID da gestação a ser atualizada.
 * @param {number} numCrias - O número de crias que o animal teve.
 * @returns {Promise<{gestacao: Gestacao, animal: Animal}>} Uma promessa que resolve para os dados de gestação e animal após o parto.
 * Realiza o parto de um animal.
 * A função recebe o id da gestação a ser concluida e o número de crias do animal. Além de atualizar a gestação
 * seleciona o animal a partir de seu identificador na gestação e insere o número de crias.
 */
async function parirAnimal(id, numCrias, data_finalizacao) {
    await pool.query("BEGIN");
    try {
        // Operação para atualizar o status da gestação
        const queryGestacao = `
            UPDATE gestacao SET 
                status  = 'concluida',
                data_finalizacao = $2
            where id = $1
            RETURNING *
        `
        const resultGestacao = await pool.query(queryGestacao, [id, data_finalizacao])

        // Operação para atualizar o número de crias do animal
        const queryAnimal = `
            UPDATE animal SET
                crias = crias + $2
            WHERE id = (
                SELECT animal_id from gestacao where id = $1
            )
            RETURNING *
        `
        const resultAnimal = await pool.query(queryAnimal, [id, numCrias])

        await pool.query("COMMIT");
        return { gestacao: resultGestacao.rows[0], animal: resultAnimal.rows[0] }

    } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
}

/**
 * @param {number} id - O ID da gestação a ser atualizada.
 * Realiza a fertilização de um animal.
 */
async function fertilizarAnimal() {
    await pool.query("BEGIN");
    try {
        // Operação para atualizar o status da gestação
        const queryGestacao = ``
        const resultGestacao = await pool.query(queryGestacao, [id, data_finalizacao])

        const resultAnimal = await pool.query(queryAnimal, [id, numCrias])

        await pool.query("COMMIT");
        return { gestacao: resultGestacao.rows[0], animal: resultAnimal.rows[0] }

    } catch (error) {
        await pool.query("ROLLBACK");
        throw error;
    }
}

/**
 * @param {number} animal_id - O ID do animal para excluir o registro de gestação.
 * @returns {Promise<Gestacao>} Uma promessa que resolve para os dados de gestação do animal especificado.
 * Exclui um registro de gestação pelo ID do animal.
 */
async function deleteGestacao(animal_id) {
    const result = await pool.query(
        "DELETE FROM gestacao WHERE animal_id = $1",
        [animal_id]
    );
    return result.rows[0];
}

export { getGestacaoById, createGestacao, updateGestacao, parirAnimal, deleteGestacao, getAllGestacoesByAnimalId };
