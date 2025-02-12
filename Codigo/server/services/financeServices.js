import express from "express";
import pool from "../db/index.js";

const router = express.Router();
router.use(express.json());

async function generateReport(range, compare) {
    const dataQuery = `
        SELECT 
            COALESCE(r.updated_at, d.updated_at) AS data,
            COALESCE(SUM(r.valor), 0) AS receita,
            COALESCE(SUM(d.valor), 0) AS despesas,
            COALESCE(SUM(r.valor), 0) - COALESCE(SUM(d.valor), 0) AS roi
        FROM 
            (SELECT updated_at, valor FROM receita WHERE updated_at BETWEEN $1 AND $2) AS r
        FULL JOIN 
            (SELECT updated_at, valor FROM despesa WHERE updated_at BETWEEN $1 AND $2) AS d
        ON r.updated_at = d.updated_at
        GROUP BY COALESCE(r.updated_at, d.updated_at)
        ORDER BY COALESCE(r.updated_at, d.updated_at);
    `;
    const totalQuery = `
        SELECT 
            COALESCE(SUM(receita), 0) AS receita,
            COALESCE(SUM(despesas), 0) AS despesas,
            COALESCE(SUM(receita), 0) - COALESCE(SUM(despesas), 0) AS roi
        FROM 
            (SELECT SUM(valor) AS receita FROM receita WHERE updated_at BETWEEN $1 AND $2) AS l
        FULL JOIN 
            (SELECT SUM(valor) AS despesas FROM despesa WHERE updated_at BETWEEN $1 AND $2) AS d
        ON true;
    `;
    const rangeData = await pool.query(dataQuery, [...range]);
    const rangeTotal = await pool.query(totalQuery, [...range]);
    let compareData = [];
    let compareTotal = {};

    if (compare.length) {
        compareData = await pool.query(dataQuery, [...compare]);
        compareData = compareData.rows;
        compareTotal = await pool.query(totalQuery, [...compare]);
        compareTotal = compareTotal.rows[0];
    }

    const result = {
        totals: {
            range: rangeTotal.rows[0],
            compare: compareTotal,
        },
        data: {
            range: rangeData.rows,
            compare: compareData,
        }
    }
    return result;
}

export { generateReport };