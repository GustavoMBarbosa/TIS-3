import express from 'express';
import pool from '../db/index.js';

const router = express.Router()

router.use(express.json())

async function listarLucro(period) {
    const where = period.length ? 'WHERE updated_at BETWEEN $1 AND $2' : '';
    const whereSub = period.length ? 'AND sub1.updated_at BETWEEN $1 AND $2' : '';

    const data = await pool.query(`
        SELECT 
            updated_at_month + INTERVAL '1 month' - INTERVAL '1 day' AS data,
            SUM(total) AS total,
            SUM(leite) AS leite,
            SUM(venda) AS venda,
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
                FROM receita AS sub1
                WHERE DATE_TRUNC('month', sub1.updated_at) = updated_at_month ${whereSub}
            ), ARRAY[]::json[]) AS childs
        FROM(
            SELECT 
                DATE_TRUNC('month', t1.updated_at) updated_at_month,
                SUM(valor) AS total,
                SUM(CASE WHEN tipo = 'leite' THEN valor ELSE 0 END) AS leite,
                SUM(CASE WHEN tipo = 'venda' THEN valor ELSE 0 END) AS venda,
                SUM(CASE WHEN tipo = 'diversos' THEN valor ELSE 0 END) AS diversos
            FROM receita as t1
            ${where}    
            GROUP BY DATE_TRUNC('month', t1.updated_at)
        )
        GROUP BY updated_at_month;
    `, period);
    return data.rows;
}

async function getLucro(id){
    const queryResult = await pool.query('SELECT * FROM receita WHERE id = $1', [id])
    return queryResult.rows[0];
}

async function createLucro(body){
    const result = await pool.query('INSERT INTO receita (descricao, tipo, valor, updated_at) VALUES ($1, $2, $3, $4)', [body.descricao, body.tipo, body.valor, body.updated_at || new Date()])
    return result.rows[0];
}

async function updateLucro(id, updates){
    const receita = await getLucro(id);
    if (!receita) throw new Error("Receita não encontrada");
    const fields = Object.keys(updates)
        .map(((field, index) => `${field} = $${index + 1}`))
        .join(", ");

    const values = Object.values(updates);
    const query = `UPDATE receita SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

async function deleteLucro(id){
    const result = await pool.query('DELETE FROM receita WHERE id = $1',[id])
    return result.rows[0];
}

export { getLucro, createLucro, updateLucro, deleteLucro, listarLucro }