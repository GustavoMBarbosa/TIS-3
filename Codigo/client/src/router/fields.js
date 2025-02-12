import { COST, PROFIT } from './financeType';

const COST_FIELDS = [
    {
        label: 'Descrição',
        value: 'descricao',
        type: 'text',
        required: true,
    },
    {
        label: 'Valor',
        value: 'valor',
        type: 'number',
        required: true,
        group: 'valor-tipo'
    },
    {
        label: 'Tipo',
        value: 'tipo',
        options: COST,
        type: 'select',
        required: true,
        group: 'valor-tipo'
    },
    {
        label: 'Selecionar data',
        value: 'selectDate',
        type: 'boolean',
        required: true,
        control: true,
    },
    {
        label: 'Selecione a data',
        value: 'updated_at',
        type: 'date',
        controlValue: 'selectDate',
        required: true,
        default: () => {
            return new Date();
        }
    },
];

const PROFIT_FIELDS = [
    {
        label: 'Descrição',
        value: 'descricao',
        type: 'text',
        required: true,
    },
    {
        label: 'Valor',
        value: 'valor',
        type: 'number',
        required: true,
        group: 'valor-tipo'
    },
    {
        label: 'Tipo',
        value: 'tipo',
        options: PROFIT,
        type: 'select',
        required: true,
        group: 'valor-tipo'
    },
    {
        label: 'Selecionar data',
        value: 'selectDate',
        type: 'boolean',
        required: true,
        control: true,
    },
    {
        label: 'Selecione a data',
        value: 'updated_at',
        type: 'date',
        controlValue: 'selectDate',
        required: true,
        default: () => {
            return new Date();
        }
    },
];

const COW_FIELDS = [
    {
        label: 'Nome',
        value: 'nome',
        type: 'text',
        required: true,
    },
    {
        label: 'Crias',
        value: 'crias',
        type: 'number',
        group: 'crias-num_insem',
        required: true,
    },
    {
        label: 'N° Inseminações',
        value: 'num_insem',
        type: 'number',
        group: 'crias-num_insem',
        required: true,
    },
    {
        label: 'Lactante',
        value: 'lactante',
        type: 'boolean',
    },
];

const WORKER_FIELDS = [
    {
        label: 'Nome',
        value: 'nome',
        type: 'text',
        required: true
    },
    {
        label: 'Cargo',
        value: 'cargo',
        type: 'text',
        required: true,
        group: 'cargo-salario'
    },
    {
        label: 'Salário',
        value: 'salario',
        type: 'number',
        required: true,
        group: 'cargo-salario'
    },
    {
        label: 'CLT',
        value: 'clt',
        type: 'boolean'
    },
];

export { COST_FIELDS, PROFIT_FIELDS, COW_FIELDS, WORKER_FIELDS };