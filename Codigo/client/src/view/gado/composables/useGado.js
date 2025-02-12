import { reactive, ref, toRefs } from "vue"
import { useFetchs } from "./useFetchs.js";

export function useGado() {

    const { getAllData, getBaseData, getAnimal, parir, secar, deletar, confirmar } = useFetchs();

    const state = reactive({
        moreDetails: ref(false),
        showInsemDialog: ref(false),
        showParirDialog: ref(false),
        showAgendarDialog: ref(false),
        isEdit: ref(false),
        headersDialog: ref([
            { text: "Nome", value: "nome", sortable: true },
            { text: "Crias", value: "crias", sortable: true, align: "center", },
            {
                text: "Data.Insem",
                value: "dataInsem",
                sortable: true,
            },
            { text: "DPIA", value: "dpia", sortable: true },
            { text: "Prev.Parto", value: "prevParto", sortable: true },
            { text: "Touro", value: "touro", sortable: true, align: "center", },
            {
                text: "Lactante",
                value: "lactante",
                sortable: true,
                align: "center",
            },
            // { text: "Num.Insem", value: "numInsem", sortable: true },
            { text: "Status", value: "status", align: "center", sortable: true },
            { text: "Secar em", value: 'secarEm' },
        ]),
        headers: ref([
            { text: "Nome", value: "nome", sortable: true },
            {
                text: "Data.Insem",
                value: "dataInsem",
                sortable: true,
            },
            { text: "Prev.Parto", value: "prevParto", sortable: true },
            { text: "Touro", value: "touro", align: "center", sortable: true },
            {
                text: "Lactante",
                value: "lactante",
                sortable: true,
                align: "center",
            },
            { text: "Status", value: "status", align: "center", sortable: true },
        ]),
        filterOptions: ref([
            {
                text: 'Seca',
                fatherValue: 'lactante',
                value: false,
                selected: false,
            },
            {
                text: 'Lactante',
                value: 'lactante',
                selected: false,
            },
            {
                text: 'Prenha',
                value: 'confirmada',
                fatherValue: 'status',
                selected: false,
            },
            {
                text: 'Sêmen',
                value: 'touro',
                childs: [
                    {
                        text: '5/8',
                        value: '5/8',
                        selected: false,
                    },
                    {
                        text: 'gir',
                        value: 'gir',
                        selected: false,
                    },
                    {
                        text: 'Touro',
                        value: 'touro',
                        selected: false,
                    },
                ],
            },
        ]),
        isLoading: ref(false),
        isDialogLoading: ref(false),
        allData: ref([]),
        gadoData: ref([]),
        animalData: ref([]),
        partoData: reactive({
            animal_id: 0 || null,
            id_parto: 0,
            crias: 0,
        })

    })

    async function loadBaseData() {
        try {
            state.isLoading = true;
            state.gadoData = await getBaseData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isLoading = false;
        }
    }

    async function createDialog() {
        try {
            state.isDialogLoading = true;
            state.moreDetails = true;
            state.allData = await getAllData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isDialogLoading = false;
        }
    }

    async function openInsemDialog(id_animal, id_gestacao, isNew) {
        try {
            state.isDialogLoading = true;
            state.showInsemDialog = true;
            state.isEdit = !isNew;
            state.animalData = isNew ? await getAnimal(id_animal) : state.gadoData.find((item) => item.id_gestacao == id_gestacao);
        } catch (e) {
            console.error(e);
        } finally {
            state.isDialogLoading = false;
        }
    }


    async function openParirDialog(id_animal, id_gestacao, isNew) {
        try {
            state.isDialogLoading = true;
            state.showParirDialog = true;
            state.isEdit = !isNew;
            state.animalData = state.gadoData.find((item) => item.id_gestacao == id_gestacao);
        } catch (e) {
            console.error(e);
        } finally {
            state.isDialogLoading = false;
        }
    }


    async function openAgendarDialog(animal) {
        state.animalData = animal;
        state.showAgendarDialog = true;
    }

    
    async function secarAnimal(id) {
        try {
            await secar(id);
            state.isLoading = true;
            state.gadoData = await getBaseData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isLoading = false;
        }
    }

    async function confirmarGestacao(id) {
        try {
            await confirmar(id);
            state.isLoading = true;
            state.gadoData = await getBaseData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isLoading = false;
        }
    }

    async function deletarAnimal(id) {
        try {
            await deletar(id);
            state.isLoading = true;
            state.gadoData = await getBaseData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isLoading = false;
        }
    }

    function getOptions(status) {
        const parirAvaliable = status === 'confirmada';
        const editGestacaoAvaliable = status !== null;
        const insemAvaliable = status === null || status === 'concluida' || status === 'falhou';
        return { parirAvaliable, editGestacaoAvaliable, insemAvaliable }
    }

    async function parirAnimal(id, crias) {
        try {
            await parir(id, crias);
            state.isLoading = true;
            state.gadoData = await getBaseData();
        } catch (e) {
            console.error(e);
        } finally {
            state.isLoading = false;
        }
    }


    return {
        ...toRefs(state),
        createDialog,
        loadBaseData,
        openInsemDialog,
        openParirDialog,
        openAgendarDialog,
        parirAnimal,
        secarAnimal,
        deletarAnimal,
        confirmarGestacao,
        getOptions
    }
}

