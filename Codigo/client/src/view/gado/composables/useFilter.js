
import { reactive, toRefs, computed } from "vue";

export function useFilter(gadoData, filterOptions, searchValue) {

    const state = reactive({
        gadoData,
        filterOptions,
        searchValue
    });

    const getSelected = computed(() => {
        const selected = [];
        state.filterOptions.forEach((option) => {
            if (option.childs) {
                const selectedChilds = option.childs
                    .filter((child) => child.selected)
                    .map((child) => ({
                        ...child,
                        fatherValue: option.value,
                    }));
                selected.push(...selectedChilds);
            } else if (option.selected) {
                selected.push(option);
            }
        });
        return selected;
    });

    const filteredData = computed(() => {
        let data = state.gadoData;
        if (getSelected.value.length) {
            data = data.filter((item) => {
                const returnItem = {};

                getSelected.value.forEach((selected) => {
                    if (selected.fatherValue) {
                        returnItem[selected.fatherValue] = returnItem[selected.fatherValue] || item[selected.fatherValue] == selected.value
                    } else {
                        returnItem[selected.value] = !!item[selected.value];
                    }
                });
                const keys = Object.keys(returnItem).filter((key) => returnItem[key]);
                if (keys.length == Object.keys(returnItem).length) return item;
            });
        }

        if (!state.searchValue) return data;

        return data.filter((item) => {
            return Object.values(item).some((value) => {
                const stringValue = String(value);
                return stringValue.toLowerCase().includes(state.searchValue.toLowerCase());
            });
        });
    });

    return {
        getSelected,
        filteredData
    }

}

