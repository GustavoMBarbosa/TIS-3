import express from "express";
import pool from "../db/index.js";

const router = express.Router();

router.use(express.json());

async function listarDespesas(period) {
    const where = period.length ? 'WHERE updated_at BETWEEN $1 AND $2' : '';
    const whereSub = period.length ? 'AND sub1.updated_at BETWEEN $1 AND $2' : '';

    const data = await pool.query(`
        SELECT 
            updated_at_month + INTERVAL '1 month' - INTERVAL '1 day' AS data,
            SUM(total) AS total,
            SUM(compra) AS compra,
            SUM(despesa_trabalhistas) AS despesa_trabalhistas,
            SUM(diversos) AS diversos,
            COALESCE(ARRAY(
                SELECT 
                    json_build_object(
                        'id', id,
                        'tipo', tipo,
                        'valor', valor,
                        'descricao', descricao,
                        'data', sub1.updated_at
                    ) 
                FROM despesa AS sub1
                WHERE DATE_TRUNC('month', sub1.updated_at) = updated_at_month ${whereSub}
            ), ARRAY[]::json[]) AS childs
        FROM(
            SELECT 
                DATE_TRUNC('month', t1.updated_at) updated_at_month,
                SUM(valor) AS total,
                SUM(CASE WHEN tipo = 'compra' THEN valor ELSE 0 END) AS compra,
                SUM(CASE WHEN tipo = 'despesa_trabalhistas' THEN valor ELSE 0 END) AS despesa_trabalhistas,
                SUM(CASE WHEN tipo = 'diversos' THEN valor ELSE 0 END) AS diversos
            FROM despesa as t1
            ${where}    
            GROUP BY DATE_TRUNC('month', t1.updated_at)
        )
        GROUP BY updated_at_month;
    `, period);
    return data.rows;
}

async function getDespesaById(id) {
    const result = await pool.query("SELECT * FROM despesa d WHERE d.id = $1", [id]);
    return result.rows[0];
}

async function createNewDespesa(body) {
    const {
        valor,
        descricao,
        tipo,
        updated_at
    } = body;

    const queryResult = await pool.query("INSERT INTO despesa (valor, descricao, tipo, updated_at) VALUES ($1, $2, $3, $4) RETURNING *", [valor, descricao, tipo, updated_at || new Date()]);
    return queryResult.rows[0];
}

async function updateDespesaById(id, updates) {
    const despesa = await getDespesaById(id);
    if (!despesa) throw new Error("Despesa não encontrada");
    const fields = Object.keys(updates)
        .map(((field, index) => `${field} = $${index + 1}`))
        .join(", ");

    const values = Object.values(updates);
    const query = `UPDATE despesa SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

async function deleteDespesaById(id) {
    const result = await pool.query("DELETE FROM despesa d WHERE d.id = $1", [id])
    return result.rows[0]
};

export {
    getDespesaById,
    createNewDespesa,
    updateDespesaById,
    deleteDespesaById,
    listarDespesas
}
