import axios from 'axios';
const APIURL = `${import.meta.env.VITE_API_URL}/lucro`

function listProfits(period = []) {
    return axios.post(`${APIURL}/list`, {period});
}

function getProfit(id) {
    return axios.get(`${APIURL}/${id}`);
}

function updateProfit(id, data) {
    return axios.put(`${APIURL}/${id}`, data);
}

function createProfit(data) {
    return axios.post(APIURL, data);
}

function deleteProfit(id) {
    return axios.delete(`${APIURL}/${id}`);
}

function importFile(data) {
    return axios.post(`${import.meta.env.VITE_API_URL}/import/receita`, data);
}

export default {
    getProfit,
    updateProfit,
    createProfit,
    deleteProfit,
    listProfits,
    importFile
}