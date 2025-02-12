import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.use(express.json());

/**
 * @param {number} id - O ID do animal para recuperar os dados.
 * @returns {Promise<Animal>} Uma promessa que resolve para os dados do animal especificado.
 * Recupera um animal pelo seu ID.
 */
async function getAnimalById(id) {
    const queryResult = await pool.query(
        "SELECT * FROM animal WHERE id = $1",
        [id]
    );
    if (!queryResult.rows.length) throw new Error("Animal não encontrado");

    return queryResult.rows[0];
}

async function createNewAnimal(body) {
    const { nome, crias, num_insem, lactante } = body;

    const result = await pool.query(
        "INSERT INTO animal(nome, crias, num_insem, lactante) VALUES ($1, $2, $3, $4)",
        [nome, crias, num_insem, lactante ? true : false]
    );
    return result.rows[0];
}

async function updateAnimalById(id, updates) {
    const animal = await getAnimalById(id);

    if (!animal) throw new Error("Animal não encontrado");

    const fields = Object.keys(updates)
        .map((field, index) => `${field} = $${index + 1}`)
        .join(", ");

    const values = Object.values(updates);

    const query = `UPDATE animal SET ${fields} WHERE id = $${values.length + 1
        } RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

async function deleteAnimalById(id) {
    const animal = await getAnimalById(id);

    if (!animal) throw new Error("Animal não encontrado");

    const result = await pool.query("DELETE FROM animal WHERE id = $1", [
        id,
    ]);

    return result.rowCount;
}

export {
    getAnimalById,
    createNewAnimal,
    updateAnimalById,
    deleteAnimalById,
};
