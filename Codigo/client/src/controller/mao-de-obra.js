import axios from 'axios'
const APIURL = `${import.meta.env.VITE_API_URL}/mao-de-obra`

async function getBase() {
    const response = await axios.get(`${APIURL}/list`);
    return response.data;
}

function getMaoDeObra(id) {
    return axios.get(`${APIURL}/${id}`);
}

async function getDistinctCargos() {
    const response = await axios.get(`${APIURL}/cargos`);
    return response;
}

function updateMaoDeObra(id, data) {
    return axios.put(`${APIURL}/${id}`, data);
}

function createMaoDeObra(data) {
    return axios.post(`${APIURL}/`, data);
}

function deleteMaoDeObra(id) {
    return axios.delete(`${APIURL}/${id}`);
}

function importFile(data) {
    return axios.post(`${import.meta.env.VITE_API_URL}/import/mao_de_obra`, data);
}

export default {
    getBase,
    getMaoDeObra,
    updateMaoDeObra,
    createMaoDeObra,
    deleteMaoDeObra,
    importFile,
    getDistinctCargos,
}
