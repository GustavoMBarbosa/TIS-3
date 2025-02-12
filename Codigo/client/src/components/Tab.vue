<script>
import { ref } from 'vue';
import Icon from './Icon.vue';

export default {
    name: 'Tab',
    components: { Icon },
    props: {
        modelValue: Number,
        items: {
            type: Array,
            default: [],
        },
        disabled: Boolean,
    },
    emits: ['update:modelValue'],
    setup() {
        return {
            model: ref(0),
        }
    },

    created() {
        this.model = this.modelValue || 0;
    },

    watch: {
        modelValue() {
            this.model = this.modelValue;
        }
    },

    methods: {
        changeTab(index) {
            this.model = index;
            this.$emit('update:modelValue', this.model);
        }
    }
}
</script>

<template>
    <div class="tab-holder">
        <div
            v-for="(item, index) in items"
            class="tab"
            :class="{'active': index === model, 'pointer-events-none': disabled}"
            @click="changeTab(index)"
        >
            <Icon
                v-if="item.icon"
                :name="item.icon"
            />
            {{ item.text ? item.text : item }}
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.tab-holder {
    display: flex;
    padding: 0.3em 0;
    border-bottom: 0.15em $green-dark solid;
    height: fit-content;
    gap: 0.5em;
}

.tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    gap: 0.3em;
    padding: 0.3em 0.5em;
    border-radius: 8px;
    cursor: pointer;
    color: $gray-500;
    font-size: 18px;

    &:hover {
        color: $green-dark;
        background: $green-100;
    }

    .material-symbols-rounded {
        font-size: 25px;
    }
}

.tab.active {
    color: $green-dark;
    background: $green-100;
}
</style>