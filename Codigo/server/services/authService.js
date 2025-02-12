import axios from "axios";
import "dotenv/config";

// Cria uma instância do Axios para reutilização, com configurações padrão
const axiosInstance = axios.create({
	baseURL: process.env.AUTH0_URL,
	headers: {
		Authorization: `Bearer ${process.env.AUTH0_ADMIN_TOKEN}`,
	},
});

async function getUserById(userId) {
	const response = await axiosInstance.get(`/api/v2/users/${userId}`);
	return response.data;
}

async function updateUser(userId, updates) {
	const response = await axiosInstance.patch(
		`/api/v2/users/${userId}`,
		updates
	);
	return response.data;
}

async function deleteUser(userId) {
	const response = await axiosInstance.delete(`/api/v2/users/${userId}`);
	return response.data;
}

export { getUserById, updateUser, deleteUser };
