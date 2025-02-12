import * as gadoServices from '../services/gadoServices.js'
import * as animalServices from '../services/animalsServices.js'

async function getAll(req, res) {
    try {
        const gado = await gadoServices.getAll();

        if (!gado) throw new Error('Nenhum gado encontrado');

        res.status(200).json(gado);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}

async function getBaseData(req, res) {
    try {
        const gado = await gadoServices.getBaseData();

        if (!gado) throw new Error('Nenhum gado encontrado');

        res.status(200).json(gado);
    } catch (e) {
        console.log(e);
        res.status(e.status).send(e.message);
    }
}

async function getByMonth(req, res) {
    try {
        const { date } = req.body;
        const gado = await gadoServices.getByMonth(date);

        if (!gado) throw new Error('Nenhum gado encontrado');

        res.status(200).json(gado);
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

async function getByStatus(req, res) {
    try {
        const { status } = req.params;
        const gado = await gadoServices.getByStatus(status.toLowerCase());

        if (!gado) throw new Error('Nenhum gado encontrado');

        res.status(200).json(gado);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}

async function getByAnimal(req, res) {
    try {
        const { animal } = req.params;

        const animal_exists = await animalServices.getAnimalById(animal);
        if (!animal_exists) throw new Error('Animal não encontrado');

        const gado = await gadoServices.getByAnimal(animal);

        if (!gado) throw new Error('Nenhum gado encontrado');

        res.status(200).json(gado);
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

async function getLactantes(req, res) {
    try {
        const lactantes = await gadoServices.getLactantes();
        res.status(200).json(lactantes);
    } catch (e) {
        res.status(e.status).send(e.message);
    }
}

async function createReport(req, res) {
    try {
        const lactatingPercentage = await gadoServices.calculateLactatingPercentage();
        const confirmedGestation = await gadoServices.calculateConfirmedGestation();
        res.status(200).json({ lactatingPercentage, confirmedGestation });
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}


export {
    getAll,
    getBaseData,
    getByMonth,
    getByStatus,
    getByAnimal,
    getLactantes,
    createReport
}

