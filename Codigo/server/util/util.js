/**
 * 
 * @param {Array} headers: Array com os headers do csv 
 * @param {Array} data : Array com os dados do csv
 * @param {String} tableName : Nome da tabela a realizar a inserção
 * @returns {Boolean}: Retorna true se for válido e false após validar se os enums são validos para as tabelas
 */
export default async function treatCsvEnums(headers, data, tableName) {

    switch (tableName) {
        case "despesa":
            return await validadeEnums(headers, data, ["despesa_trabalhistas", "diversos", "compra"]);
        case "receita":
            return await validadeEnums(headers, data, ["leite", "venda", "diversos"]);
        default:
            return true;
    }

}

async function validadeEnums(headers, data, validTypes) {
    const typeIndex = headers.indexOf('tipo');
    return data.every(row => validTypes.includes(row[typeIndex].toLowerCase()));
}

