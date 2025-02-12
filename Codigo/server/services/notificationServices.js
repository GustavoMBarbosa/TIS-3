import express from 'express'
import pool from '../db/index.js'

const router = express.Router()

router.use(express.json())

async function getNotificationById(id) {
    const queryResult = await pool.query("SELECT * FROM notificacao WHERE id = $1", [id])
    return queryResult.rows[0]
}

async function getNotification(animal_id, title) {
    const queryResult = await pool.query("SELECT * FROM notificacao WHERE animal_id = $1 AND titulo = $2", [animal_id, title])
    return queryResult.rows[0]
}

async function getAllNotifications() {
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);

    const queryResult = await pool.query("SELECT * FROM notificacao WHERE vencimento BETWEEN $1 AND $2 ORDER BY vencimento", [minDate, maxDate]);
    return queryResult.rows
}

async function createNewNotification(body) {
    const queryResult = await pool.query('INSERT INTO notificacao (titulo, descricao, vencimento, animal_id) VALUES ($1, $2, $3, $4) RETURNING *', [body.titulo, body.descricao, body.vencimento, body.animal_id])
    return queryResult.rows[0];
}

async function updateNotification(id, updates) {
    const notication = await getNotificationById(id);
    if (!notication) throw new Error("Notificação não encontrada");

    const fields = Object.keys(updates)
        .map(((field, index) => `${field} = $${index + 1}`))
        .join(", ");

    const values = Object.values(updates);
    const query = `UPDATE notificacao SET ${fields} WHERE id = $${values.length + 1} RETURNING *`;
    const result = await pool.query(query, [...values, id]);
    return result.rows[0];
}

async function deleteNotificationById(id) {
    const queryResult = await pool.query('DELETE FROM notificacao WHERE id = $1', [id])
    return queryResult
}

async function getAllNotificationsByAnimalId(animal_id) {
    const queryResult = await pool.query("SELECT * FROM notificacao WHERE animal_id = $1", [animal_id])
    return queryResult.rows
}

async function deleteNotificationsByAnimalId(animal_id) {
    const queryResult = await pool.query("DELETE FROM notificacao WHERE animal_id = $1", [animal_id])
    return queryResult
}

export {
    getNotification,
    createNewNotification,
    updateNotification,
    deleteNotificationById,
    getAllNotifications,
    getAllNotificationsByAnimalId,
    deleteNotificationsByAnimalId
}
