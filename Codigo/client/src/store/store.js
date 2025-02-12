import { createStore } from 'vuex'

export default createStore({
    state: {
        iconsLoaded: false,
    },
    mutations: {
        setIconsLoaded(state, payload) {
            state.iconsLoaded = payload;
        }
    },
    actions: {
        loadIcons({ commit }) {
            setTimeout(() => {
                commit('setIconsLoaded', true);
            }, 3000);
        }
    }
});