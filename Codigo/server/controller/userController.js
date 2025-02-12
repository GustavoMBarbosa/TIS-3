import * as userServices from '../services/userServices.js'

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {user}
 * Função para procurar um usuário pelo seu email
 */
async function getUserByEmail(req, res) {
    try {
        const email = req.params.email
        const user = await userServices.getUserByEmail(email)

        res.json(user)

    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao fazer query por email' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {user}
 * Função para procurar um usuário pelo seu token do auth0
 */
async function getUserByToken(req, res) {
    try {
        const token = req.params.token
        const user = await userServices.getUserByToken(token)

        if (!user) throw new Error('Usuário não encontrado')

        res.json(user)

    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao fazer query por token' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {user}
 * Função para criar um novo usuário
 */
async function createNewUser(req, res) {
    try {
        const body = req.body
        const user = await userServices.createNewUser(body)
        res.json(user)
    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao fazer post' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {user}
 * Função para atualizar um usuário
 */
async function updateUser(req, res) {
    try {
        const { id } = req.params
        const body = req.body
        const user = await userServices.updateUser(id, body)
        res.json(user)
    } catch (error) {
        console.error(error);
        res.status(error.status).send('Erro ao fazer update de usuário' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {user}
 * Função para deletar um usuário
 */
async function deleteUser(req, res) {
    try {
        const body = req.body
        const user = await userServices.deleteUser(body)
        res.json(user)
    } catch (error) {
        console.error(error);
        res.status(error.status).send('Erro ao fazer delete de usuário' + error.message)
    }
}

export { getUserByEmail, getUserByToken, createNewUser, updateUser, deleteUser }

