import axios from 'axios';
const APIURL = `${import.meta.env.VITE_API_URL}/despesas`

function listCosts(period = []) {
    return axios.post(`${APIURL}/list`, {period});
}

function getCost(id) {
    return axios.get(`${APIURL}/${id}`);
}

function updateCost(id, data) {
    return axios.put(`${APIURL}/${id}`, data);
}

function createCost(data) {
    return axios.post(APIURL, data);
}

function deleteCost(id) {
    return axios.delete(`${APIURL}/${id}`);
}

function importFile(data) {
    return axios.post(`${import.meta.env.VITE_API_URL}/import/despesa`, data);
}

export default {
    getCost,
    updateCost,
    createCost,
    deleteCost,
    listCosts,
    importFile
}