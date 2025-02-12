import axios from "axios";
import gestacaoServices from "./gestacao";
import animalServices from "./animal";

const APIURL = `${import.meta.env.VITE_API_URL}/gado` || "http://localhost:3002/gado";

async function getAll() {
    const response = await axios.get(`${APIURL}/`);
    return response.data;
}

async function getBase() {
    const response = await axios.get(`${APIURL}/base`);
    return response.data;
}

async function getReport() {
    const response = await axios.get(`${APIURL}/report`);
    return response.data;
}

function createGado(gado) {
    return axios.post(`${APIURL}/animals`, gado);
}

function updateGado(gado) {
    return axios.put(`${APIURL}/animals/${gado.id}`, gado);
}

async function deleteGado(id) {
    const deleteGestacao = await gestacaoServices.deletarGestacao(id);

    const deleteAnimal = animalServices.deletarAnimal(id);
    return { deleteGestacao, deleteAnimal };
}

export default {
    getAll,
    getBase,
    getReport,
    createGado,
    updateGado,
    deleteGado,
};
