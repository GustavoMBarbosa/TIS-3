import * as importServices from '../services/importServices.js';
import treatCsvEnums from '../util/util.js';

async function insertMultipleBasic(req, res) {
    try {
        const { headers, data } = req.body;
        const { tableName } = req.params;

        const isEnumValid = await Promise.resolve(treatCsvEnums(headers, data, tableName));

        if (!isEnumValid) throw new Error('Tipos inválidos');

        const insert = await importServices.insertMultipleBasic(headers, data, tableName);
        res.status(200).json(insert);
    } catch (e) {
        console.error(e);
        res.status(e.status || 500).send(e.message);
    }
}

export {
    insertMultipleBasic
}

