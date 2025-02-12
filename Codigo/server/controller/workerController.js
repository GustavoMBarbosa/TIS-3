import * as workerServices from "../services/workerServices.js";

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {worker}
 * Função para listar funcionários
 */
async function listWorkers(req, res) {
    try {
        const worker = await workerServices.listWorkers()

        if (!worker) throw new Error('Funcionários não encontrados')

        res.status(200).json(worker)

    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao listar funcionários' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {worker}
 * Função para procurar um funcionário
 */
async function getWorker(req, res) {
    try {
        const { id } = req.params
        const worker = await workerServices.getWorker(id)

        if (!worker) throw new Error('Funcionário não encontrado')

        res.status(200).json(worker)

    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao procurar funcionário' + error.message)
    }
}

/**
 * 
 * @param { nome, salario, cargo, clt } req 
 * @param {*} res 
 * @returns {worker}
 * Função para criar um novo funcionário
 * 
 */
async function createWorker(req, res) {
    try {
        const body = req.body
        const worker = await workerServices.createWorker(body)
        res.status(200).json(worker)
    } catch (error) {
        console.error(error)
        res.status(error.status).send('Erro ao criar funcionário' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {worker}
 * Função para atualizar um funcionário
 */
async function updateWorker(req, res) {
    try {
        const { id } = req.params;
        const body = req.body;
        const worker = await workerServices.updateWorker(id, body)
        res.status(200).json(worker)
    } catch (error) {
        console.error(error);
        res.status(error.status).send('Erro ao editar funcionário' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {worker}
 * Função para deletar um funcionário
 */
async function deleteWorker(req, res) {
    try {
        const { id } = req.params;
        const worker = await workerServices.deleteWorker(id)
        res.status(200).json(worker)
    } catch (error) {
        console.error(error);
        res.status(error.status).send('Erro ao deletar funcionário' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {cargo[]}
 * Função para pegar todos os cargos de usuário
 */
async function getDistinctCargos(req, res) {
    try {
        const worker = await workerServices.getDistinctCargos();
        res.status(200).json(worker);
    } catch (error) {
        console.error(error);
        res.status(error.status).send('Erro ao deletar funcionário' + error.message)
    }
}

export { listWorkers, getWorker, createWorker, updateWorker, deleteWorker, getDistinctCargos }