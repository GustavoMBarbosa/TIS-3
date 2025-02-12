const components = {
    schemas: {
        Animal: {
            type: "object",
            properties: {
                nome: { type: "string" },
                crias: { type: "number" },
                num_insem: { type: "number" },
                lactante: { type: "boolean" },
                primeira_ia: { type: "date" }
            },
            required: ["nome", "crias", "num_insem", "lactante"],
            example: {
                nome: "Mumuzinha",
                crias: 2,
                num_insem: 1,
                dias_parida: 10,
                lactante: true,
                primeira_ia: "2024-02-09"
            }
        },
        Gestacao: {
            type: "object",
            properties: {
                animal_id: { type: "number" },
                status: { type: "string", enum: ["pendente", "confirmada", "concluida", "falhou"] },
                prev_parto: { type: "date" },
                touro: { type: "string", enum: ["5/8", "gir", "nelore", "touro"] },
                data_insem: { type: "date" },
                data_finalizacao: { type: "date" }
            },
            required: ["animal_id", "status", "touro", "data_insem"],
            example: {
                animal_id: 2,
                status: "pendente",
                prev_parto: "2024-02-09",
                touro: "5/8",
                data_insem: "2024-02-09",
                data_finalizacao: "2024-10-09"
            }
        },
        Despesa: {
            type: "object",
            properties: {
                id: { type: "string" },
                valor: { type: "number" },
                descricao: { type: "string" },
                tipo: {
                    type: "string",
                    enum: ["compra", "despesa_trabalhistas", "diverso"]
                },
                updated_at: { type: "date" }
            },
            required: ["valor", "descricao", "tipo"],
            example: {
                valor: 150.0,
                descricao: "Compra de equipamentos",
                tipo: "compra",
                updated_at: "2024-02-09"
            }
        },
        Receita: {
            type: "object",
            properties: {
                id: { type: "string" },
                valor: { type: "number" },
                descricao: { type: "string" },
                tipo: {
                    type: "string",
                    enum: ["leite", "venda", "diverso"]
                },
                data_receita: { type: "date" }
            },
            required: ["valor", "descricao", "tipo"],
            example: {
                valor: 400.0,
                descricao: "Entrega de leite",
                tipo: "leite",
                data_receita: "2024-02-09"
            }
        },
        Mao_de_obra: {
            type: "object",
            properties: {
                nome: { type: "string" },
                salario: { type: "number" },
                cargo: { type: "string" },
                clt: { type: "boolean" }
            },
            required: ["nome", "salario", "cargo"],
            example: {
                nome: "João",
                salario: 1500.0,
                cargo: "Vaqueiro",
                clt: true
            }
        },
        Imports: {
            type: "object",
            properties: {
                tableName: { type: "string" },
                headers: { type: "array", items: { type: "string" } },
                data: { type: "array", items: { type: "object" } }
            }
        }

    },
};

export default components;

