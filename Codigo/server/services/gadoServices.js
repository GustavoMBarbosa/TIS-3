import express from 'express';
import pool from "../db/index.js";

const router = express.Router();

router.use(express.json());

async function getAll() {
    const queryResult = await pool.query(`
        SELECT a.*, g.*
        FROM animal a
        LEFT JOIN (
            SELECT *,
            ROW_NUMBER() OVER(PARTITION BY animal_id ORDER BY CASE WHEN status IN ('pendente', 'confirmada') THEN 1 ELSE 2 END, data_insem DESC) as rn
            FROM gestacao
        ) g ON a.id = g.animal_id AND g.rn = 1
        ORDER BY a.nome
    `);
    return queryResult.rows;
}

async function getBaseData() {
    const queryResult = await pool.query(`
    SELECT 
            a.id as id_animal, 
            a.nome, 
            g.id as id_gestacao, 
            g.data_insem, 
            g.prev_parto, 
            g.touro, 
            g.status, 
            a.lactante
        FROM animal a
        LEFT JOIN (
            SELECT *,
            ROW_NUMBER() OVER(PARTITION BY animal_id ORDER BY CASE WHEN status IN ('pendente', 'confirmada') THEN 1 ELSE 2 END, data_insem DESC) as rn
            FROM gestacao
        ) g ON a.id = g.animal_id AND g.rn = 1
        ORDER BY a.nome
    `);
    return queryResult.rows;
}

async function getByMonth(date) {
    const [month, year] = date.split('-')
    const queryResult = await pool.query('SELECT * FROM animal a JOIN gestacao g ON a.nome = g.nome_animal WHERE EXTRACT(MONTH FROM g.prev_parto) = $1 AND EXTRACT(YEAT FROM g.prev_parto) = $2', [month, year]);
    return queryResult.rows;
}

async function getByStatus(status) {
    const queryResult = await pool.query('SELECT * FROM animal a JOIN gestacao g ON a.nome = g.nome_animal WHERE g.status = $1', [status]);
    return queryResult.rows;
}

async function getByAnimal(animal) {
    const queryResult = await pool.query('SELECT * FROM animal a JOIN gestacao g ON a.nome = g.nome_animal WHERE g.nome_animal = $1', [animal]);
    return queryResult.rows;
}

async function getLactantes() {
    const queryResult = await pool.query('SELECT * FROM animal a JOIN gestacao g ON a.nome = g.nome_animal WHERE a.lactante = true');
    return queryResult.rows;
}

async function calculateLactatingPercentage() {
    const queryResult = await pool.query(`
    SELECT
        (COUNT(*) FILTER (WHERE lactante = true) * 100.0 / COUNT(*)) AS porcentagem_lactantes
    FROM animal;
    `);
    return queryResult.rows[0];
}

async function calculateConfirmedGestation() {
    const queryResult = await pool.query(`
    SELECT (COUNT(*) FILTER (WHERE status = 'confirmada'))
    FROM gestacao;
    `);
    return queryResult.rows[0];
}

export {
    getAll,
    getByMonth,
    getByStatus,
    getByAnimal,
    getLactantes,
    getBaseData,
    calculateLactatingPercentage,
    calculateConfirmedGestation
}

