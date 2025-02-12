import * as authService from "../services/authService.js";

async function getUser(req, res) {
    try {
        const user = await authService.getUserById(req.params.authId);
        return res.json(user);
    } catch (error) {
        console.error(error);
        res.status(error.response.status).json(error.response.data);
    }
}

async function updateUser(req, res) {
    const userId = req.params.authId;
    const updates = req.body;

    try {
        const updatedUser = await authService.updateUser(userId, updates);
        return updatedUser;
    } catch (error) {
        console.log(error)
        res.status(error.response.status).json(error.response.data);
    }
}

async function deleteUser(req, res) {
    const userDelete = authService.deleteUser(req.params.authId);
    res.json(userDelete);
}

export { getUser, updateUser, deleteUser };
