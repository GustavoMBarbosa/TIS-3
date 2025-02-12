import { reactive, toRefs, ref } from 'vue'
import maoDeObraController from '@/controller/mao-de-obra.js';

export function useFetchs() {

    const state = reactive({
        isLoading: ref(false),
        maoDeObraData: ref([])
    })

    async function getBaseData() {
        state.isLoading = true;
        try {
            state.maoDeObraData = await maoDeObraController.getBase();
        } catch (error) {
        } finally {
            state.isLoading = false;
        }
    }

    async function deleteMaoDeObra(id) {
        await maoDeObraController.deleteMaoDeObra(id);
    }

    async function getCargos() {
        state.isLoading = true;
        const { data } = await maoDeObraController.getDistinctCargos();
        state.isLoading = false;
        return data;
    }

    return {
        ...toRefs(state),
        getBaseData,
        deleteMaoDeObra,
        getCargos,
    }
}