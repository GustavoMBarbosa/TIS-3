<script>
import { ref } from 'vue';
import Icon from './Icon.vue';

export default {
    name: 'SelectContainer',
    components: { Icon },
    props: {
        modelValue: {
            type: Boolean,
            default: false
        },
        icon: String,
        label: String,
        disabled: Boolean,
    },
    emits: ['update:modelValue'],
    setup() {
        return {
            model: ref(false),
            content: ref(),
            container: ref(),
            labelContainer: ref(),
            resizeObserver: null,
        }
    },

    beforeMount() {
        this. resizeObserver = new ResizeObserver(this.resize);
    },

    mounted() {
        this.model = this.modelValue;

        if (this.container) this.resizeObserver.observe(this.container, { box: 'border-box' });
        if (this.content) this.resizeObserver.observe(this.content, { box: 'border-box' });
        if (this.labelContainer) this.resizeObserver.observe(this.labelContainer, { box: 'border-box' });
    },

    updated() {
        this.resize();
    },

    beforeUnmount() {
        if (this.resizeObserver) this.resizeObserver.disconnect();
    },

    watch: {
        modelValue() {
            this.model = this.modelValue
        },
    },

    methods: {
        changeModel(value) {
            this.model = value;
            this.$emit('update:modelValue', this.model);
        },

        resize() {
            if (!this.labelContainer || !this.content) return;

            this.content.style.maxHeight = this.model ? `${this.content.scrollHeight + 1}px` : '0px';

            this.content.style.width = 'fit-content';
            this.labelContainer.style.width = '';

            const width = Math.max(this.content.offsetWidth, this.labelContainer.offsetWidth);

            if (this.container && (this.container.style.width || (this.container.offsetWidth != width))) {
                this.content.style.width = '100%';
                this.labelContainer.style.width = '100%';
            } else {
                this.content.style.width = `${width}px`;
                this.labelContainer.style.width = `${width}px`;
            }
        }
    }
}
</script>

<template>
    <div class="flex flex-col gap-1">
        <label v-if="label" class="label">{{ label }}</label>
        <div ref="container" class="select-container relative min-w-[5em]" tabindex="0" @blur="changeModel(false)">
            <div ref="labelContainer" class="label-container" @click="changeModel(!model)" :class="{'active': model, 'disabled': disabled}">
                <div class="flex gap-4 truncate">
                    <Icon :name="icon" class="select-none" v-if="icon" />
                    <slot name="status" />
                </div>
                <Icon
                    name="arrow_drop_down"
                    class="transition duration-150 select-none"
                    :class="{'rotate-180': model}"
                />
            </div>
            <div ref="content" class="select-content absolute z-50 top-full left-0 overflow-hidden transition-[max-height] bg-white" :class="{'active': model}" style="max-height: 0;">
                <slot name="item" />
            </div>
        </div>
    </div>
</template>


<style scoped lang="scss">
@import "../style/var.scss";

.label {
    color: $green-dark;
    font-weight: 600;
}

.label-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 2.5em;
    border-radius: 8px;
    border: 0.15em $gray-300 solid;
    padding: 0.5em;
    color: $gray-500;
    background: white;
    cursor: pointer;

    .material-symbols-rounded {
        font-size: 22px;
        color: $gray-500;
    }
}

.label-container.active {
    border-color: $blue-light;
    border-bottom: 0.15em $gray-300 solid;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;

    .material-symbols-rounded {
        color: $blue-light;
    }
}

.active.select-content {
    border: 0.15em $blue-light solid;
    border-top: none;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
}

.disabled {
    @apply pointer-events-none;
    border-color: $gray-300;
    background: $gray-200;
}
</style>