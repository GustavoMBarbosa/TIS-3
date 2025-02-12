import express, { query } from "express";
import pool from "../db/index.js";

/**
 * @param {Array} headers 
 * @param {Array} data 
 * @param {string} tableName 
 * A função recebe um array contendo os headers da tabela, um array contendo os dados a serem inseridos e o nome da tabela em questão.
 * Possiveis tables:
 *  - mao_de_obra
 *  - despesa
 *  - receita
 */
async function insertMultipleBasic(headers, data, tableName) {
    const column = headers.join(',');
    const placeholders = data.map((_, index) => `(${headers.map((_, i) => `$${index * headers.length + i + 1}`).join(', ')})`).join(', ');
    const values = data.flat();
    const query = `INSERT INTO ${tableName} (${column}) VALUES ${placeholders};`;

    const result = await pool.query(query, values);
    return result.rows[0];
}

export { insertMultipleBasic };

