import * as gestacaoServices from "../services/gestacaoServices.js";
import * as animalServices from "../services/animalsServices.js";

async function getGestacaoById(req, res) {
    try {
        const { animal_id } = req.params;
        const animal_exists = await animalServices.getAnimalById(animal_id);

        if (!animal_exists) throw new Error("Animal não encontrado");

        const gestacao = await gestacaoServices.getGestacaoById(animal_id);
        res.json(gestacao);
    } catch (error) {
        console.error(error);
        res.status(error.status).send("Erro ao executar a query " + error.message);
    }
}

async function createGestacao(req, res) {
    try {
        const body = req.body;
        const animal = await animalServices.getAnimalById(body.animal_id);
        if (!animal) throw new Error("Animal não encontrado");

        const gestacao = await gestacaoServices.createGestacao(body);
        res.json(gestacao);
    } catch (e) {
        console.error(e);
        res.status(e.status).send("Erro ao executar a query " + e.message);
    }
}

async function updateGestacao(req, res) {
    try {
        const body = req.body;
        const { id } = req.params;

        const gestacao = await gestacaoServices.updateGestacao(id, body);
        res.status(200).json(gestacao);
    } catch (error) {
        console.error(error);
        res.status(error.status).send("Erro ao executar a query " + error.message);
    }
}

async function parirAnimal(req, res) {
    try {
        const { crias, data_finalizacao } = req.body;
        const { id } = req.params;

        const gestacao = await gestacaoServices.parirAnimal(id, crias, data_finalizacao);
        res.status(200).json(gestacao);
    } catch (error) {
        console.error(error);
        res.status(error.status).send("Erro ao executar a query " + error.message);
    }
}

async function deleteGestacao(req, res) {
    try {
        const { animal_id } = req.params
        const animal = await animalServices.getAnimalById(animal_id);
        if (!animal) throw new Error("Animal não encontrado");



        const gestacao = await gestacaoServices.deleteGestacao(animal_id);
        res.json(gestacao);
    } catch (error) {
        res.status(error.status).send("Erro ao executar a query " + error.message);
    }
}

export { getGestacaoById, createGestacao, updateGestacao, parirAnimal, deleteGestacao };
