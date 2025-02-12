<script>
import { ref } from 'vue';

export default {
    name: 'Checkbox',
    props: {
        modelValue: Boolean,
        disabled: Boolean,
    },
    emits: ['update:modelValue'],
    setup() {
        return {
            model: ref(),
        }
    },

    created() {
        this.model = this.modelValue;
    },

    watch: {
        modelValue() {
            this.model = this.modelValue;
        }
    },

    methods: {
        changeModel(value) {
            this.model = value;
            this.$emit('update:modelValue', this.model);
        },
    }
}
</script>

<template>
    <div class="checkbox-holder" :class="{'pointer-events-none': disabled}" @click="changeModel(!model)">
        <div class="checkbox" :class="{'active': model, 'disabled': disabled}">
            <svg v-show="model === true" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full" style="stroke: currentColor">
                <path id="Vector" d="M11.15 6L7.04998 9.9375L5 7.96875" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </div>
        <p><slot /></p>
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.checkbox-holder {
    display: flex;
    align-items: center;
    gap: 0.5em;
    cursor: pointer;

    p {
        color: $gray-500;
        user-select: none;
    }
}

.checkbox {
    width: 20px;
    height: 20px;
    border-radius: 4px;
    border: 0.1em $gray-300 solid;
    color: white;
    background: white;
}

.checkbox.active {
    background: $green-dark;
    border-color: $green-dark;
}

.checkbox.disabled {
    background: $gray-300;
    border-color: $gray-300;
}
</style>