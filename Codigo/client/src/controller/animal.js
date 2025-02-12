import axios from "axios";
const APIURL = `${import.meta.env.VITE_API_URL}/animals`

function createAnimal(animal) {
    return axios.post(`${APIURL}/`, animal);
}

async function getAnimal(id) {
    const response = await axios.get(`${APIURL}/${id}`);
    return response.data;
}

function updateAnimal(id, animal) {
    return axios.put(`${APIURL}/${id}`, animal);
}

async function secar(animal_id) {
    return await axios.put(`${APIURL}/${animal_id}`, { lactante: false });
}

async function deletarAnimal(id) {
    return await axios.delete(`${APIURL}/${id}`);
}

function importFile(data) {
    return axios.post(`${import.meta.env.VITE_API_URL}/import/animal`, data);
}

export default {
    createAnimal,
    getAnimal,
    updateAnimal,
    secar,
    deletarAnimal,
    importFile
}

