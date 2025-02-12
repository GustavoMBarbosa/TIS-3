import { reactive, toRefs, ref } from 'vue'
import gadoController from '../../../controller/gado.js';
import animalsController from '../../../controller/animal.js';
import gestacaoController from '../../../controller/gestacao.js';


export function useFetchs() {

    async function getBaseData() {
        const data = await gadoController.getBase();
        return data;
    }

    async function getAllData() {
        const data = await gadoController.getAll();
        return data;

    }

    async function getAnimal(id) {
        const data = await animalsController.getAnimal(id);
        return data;
    }

    async function parir(animal_id, crias) {
        const data = await gestacaoController.parir(animal_id, crias);
        return data;
    }

    async function confirmar(animal_id) {
        const data = await gestacaoController.confirmarGestacao(animal_id);
        return data;
    }

    async function secar(id) {
        const data = await animalsController.secar(id);
        return data;
    }

    async function deletar(id) {
        const data = await animalsController.deletarAnimal(id);
        const dataGestacao = await gestacaoController.deletarGestacao(id);
        return data && dataGestacao;
    }

    async function getReport() {
        const data = await gadoController.getReport();
        return data;
    }

    return {
        getBaseData,
        getAllData,
        getAnimal,
        getReport,
        parir,
        secar,
        deletar,
        confirmar
    }
}

