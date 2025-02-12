import * as lucroServices from "../services/lucroServices.js"

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {lucros}
 * Função para listar os lucros
 */

async function listarLucro(req, res){
    try {
        const { period } = req.body;
        const lucros = await lucroServices.listarLucro(period);

        if(!lucros) throw new Error('Error ao listar lucros')

        res.json(lucros)
    } catch (error) {
    console.error(error)
    res.status(error.status).send('Erro ao fazer query pela descrição' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {lucro}
 * Função para procurar um lucro
 */

async function getLucro(req, res){
    try {
        const id = req.params.id
        const lucro = await lucroServices.getLucro(id)

        if(!lucro) throw new Error('Lucro não encontrado')

        res.json(lucro)
    } catch (error) {
    console.error(error)
    res.status(error.status).send('Erro ao fazer query pela descrição' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {worker}
 * Função para adicionar novo lucro
 */
async function createLucro(req, res){
    try{
        const body = req.body
        const lucro = await lucroServices.createLucro(body)
        res.json(lucro)
    } catch(error) {
        console.error(error)
        res.status(error.status).send('Erro ao fazer post' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {lucro}
 * Função para atualizar um lucro
 */
async function updateLucro(req, res){
    try {
        const { id } = req.params;
        const body = req.body;
        const lucro = await lucroServices.updateLucro(id, body);
        res.json(lucro);

    } catch(error) {
        console.error(error);
        res.status(error.status).send('Erro ao fazer update do lucro' + error.message)
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns {lucro}
 * Função para deletar um lucro
 */
async function deleteLucro(req,res){
    try{
        const { id } = req.body
        const lucro = await lucroServices.deleteLucro(id)
        res.json(lucro)
    } catch (error){
        console.error(error);
        res.status(error.status).send('Erro ao deletar Lucro' + console.error)
    }
}

export { getLucro, createLucro, updateLucro, deleteLucro, listarLucro }