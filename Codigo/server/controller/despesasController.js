import * as despesasServices from "../services/despesasServices.js";

async function listarDespesas(req, res) {
    try {
        const { period } = req.body;
        const despesas = await despesasServices.listarDespesas(period);

        if (!despesas) throw new Error("Erro ao listar despesas");

        res.send(despesas);
    } catch (e) {
        console.error(e)
        res.status(e.status).send(e.message);
    }
}

async function getDespesaById(req, res) {
    try {
        const { id } = req.params;
        const despesa = await despesasServices.getDespesaById(id);

        if (!despesa) throw new Error("Despesa não encontrada");

        res.send(despesa);
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

async function createNewDespesa(req, res) {
    try {
        const body = req.body;
        const despesa = await despesasServices.createNewDespesa(body);
        res.send(despesa);
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

async function updateDespesaById(req, res) {
    try {
        const { id } = req.params;
        const body = req.body;
        const despesa = await despesasServices.updateDespesaById(id, body);

        if (!despesa) throw new Error("Despesa não encontrada");

        res.send(despesa);
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

async function deleteDespesaById(req, res) {
    try {
        const { id } = req.params;
        const despesa = await despesasServices.getDespesaById(id);

        if (!despesa) throw new Error("Despesa não encontrada");

        await despesasServices.deleteDespesaById(id);
        res.send("Despesa deletada com sucesso");
    } catch (e) {
        console.error(e);
        res.status(e.status).send(e.message);
    }
}

export { getDespesaById, createNewDespesa, updateDespesaById, deleteDespesaById, listarDespesas };
