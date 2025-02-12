import express, { response } from 'express'
import pool from '../db/index.js'

const router = express.Router()

router.use(express.json())

async function listWorkers() {
    const queryResult = await pool.query("SELECT * FROM mao_de_obra ORDER BY nome")
    return queryResult.rows;
}

async function getWorker(id) {
    const queryResult = await pool.query("SELECT * FROM mao_de_obra WHERE id = $1", [id])
    return queryResult.rows[0];
}

async function createWorker(body) {
    const result = await pool.query('INSERT INTO mao_de_obra (nome, salario, cargo, clt) VALUES ($1, $2, $3, $4)', [body.nome,
    body.salario, body.cargo, body.clt])
    return result.rows[0];
}

async function updateWorker(id, updates){
    const worker = await getWorker(id);
    if (!worker) throw new Error("Mão de Obra não encontrada");

    const fields = Object.keys(updates)
        .map(((field, index) => `${field} = $${index + 1}`))
        .join(", ");

    const values = Object.values(updates);
    const query = `UPDATE mao_de_obra SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

async function deleteWorker(id) {
    const result = await pool.query('DELETE FROM mao_de_obra WHERE id = $1', [id])
    return result.rows[0];
}

async function getDistinctCargos() {
    const queryResult = await pool.query("SELECT DISTINCT cargo FROM mao_de_obra ORDER BY cargo")
    return queryResult.rows;
}

export { listWorkers, getWorker, createWorker, updateWorker, deleteWorker, getDistinctCargos }