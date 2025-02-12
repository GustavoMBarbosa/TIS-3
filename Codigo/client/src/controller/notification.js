import axios from "axios";
const APIURL = `${import.meta.env.VITE_API_URL}/notification`

async function getAll() {
    const response = await axios.get(`${APIURL}/list`);
    return response.data;
}

async function getNotification(animal_id, title) {
    return await axios.get(`${APIURL}/${animal_id}/${title}`);
}

async function getFertilizacaoNotification(animal_id) {
    return await getNotification(animal_id, 'Fertilização');
}

async function getBirthNotification(animal_id) {
    return await getNotification(animal_id, 'Parto');
}

async function getDryNotification(animal_id) {
    return await getNotification(animal_id, 'Secagem');
}

async function createNotification(data) {
    return await axios.post(`${APIURL}`, data);
}

async function createFertilizacaoNotification(date, animal) {
    const data = {
        titulo: 'Fertilização',
        descricao: `O dia de fertilizar a ${animal.nome} está chegando`,
        vencimento: date,
        animal_id: animal.id,
    };
    return await createNotification(data);
}

async function createBirthNotification(date, animal) {
    const data = {
        titulo: 'Parto',
        descricao: `O dia de ${animal.nome} parir está chegando`,
        vencimento: date,
        animal_id: animal.id,
    };
    return await createNotification(data);
}

async function createDryNotification(date, animal) {
    const data = {
        titulo: 'Secagem',
        descricao: `O dia de secar ${animal.nome} está chegando`,
        vencimento: date,
        animal_id: animal.id,
    };
    return await createNotification(data);
}



async function updateNotification(id, date) {
    return axios.put(`${APIURL}/${id}`, { vencimento: date });
}

async function deleteNotification(id) {
    return axios.delete(`${APIURL}/${id}`);
}

export default {
    getAll,
    deleteNotification,
    createNotification,
    createFertilizacaoNotification,
    createBirthNotification,
    getNotification,
    getFertilizacaoNotification,
    getBirthNotification,
    updateNotification,
    getDryNotification,
    createDryNotification
}



