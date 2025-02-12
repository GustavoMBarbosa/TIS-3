import { ref, onMounted, onUnmounted } from 'vue';
import store from '../store/store';  // Adicione o caminho correto para sua store Vuex

export const useIconLoader = () => {
    const loaded = ref(false);

    setTimeout(() => {
        loaded.value = true;
        store.commit('setIconsLoaded', true);
    }, 3000);

    return { loaded };
};