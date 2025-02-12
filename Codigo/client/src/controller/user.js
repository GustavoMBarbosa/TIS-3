import axios from 'axios';
const APIURL = `${import.meta.env.VITE_API_URL}/user`

function getUser(id) {
    return axios.get(`${APIURL}/${id}`);
}

function updateUser(id, body) {
    return axios.put(`${APIURL}/${id}`, body);
}

function createUser() {
    return axios.post(APIURL);
}

function deleteUser(id) {
    return axios.delete(`${APIURL}/${id}`);
}

export default {
    getUser,
    updateUser,
    createUser,
    deleteUser
}