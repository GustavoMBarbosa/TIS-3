import axios from 'axios';
const APIURL = `${import.meta.env.VITE_API_URL}/finance`

function generateReport(range, compare) {
    return axios.post(`${APIURL}`, { range, compare });
}

export default {
    generateReport
}