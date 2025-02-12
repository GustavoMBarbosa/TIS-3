import * as financeServices from "../services/financeServices.js";

async function generateReport(req, res) {
    try {
        const { range, compare } = req.body;
        const report = await financeServices.generateReport(range, compare);

        if (!report) throw new Error("Erro ao gerar o relatório");

        res.send(report);
    } catch (e) {
        console.error(e)
        res.status(e.status).send(e.message);
    }
}
export { generateReport }