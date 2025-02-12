<script>
import { ref } from 'vue';
import Icon from './Icon.vue';

export default {
    name: 'File',
    components: { Icon },
    props: {
        modelValue: [File, null],
    },
    emits: ['update:modelValue'],
    setup() {
        const defaultAlert = ref({
            top: true,
            right: true,
            timeout: 3500,
        });

        return {
            defaultAlert,
            dragging: ref(false),
            model: ref(),
        }
    },

    created() {
        this.model = this.modelValue;
    },

    watch: {
        modelValue() {
            this.model = this.modelValue
        }
    },

    methods: {
        changeModel(value) {
            this.model = value;
            this.$emit('update:modelValue', this.model);
        },
        onChangeFile(e) {
            const files = e.target.files || e.dataTransfer.files;
            const file = files[0];
            if (!file.type.match(/csv/)) {
                this.$alert({
					message: 'Apenas arquivos csv são aceitos',
					...this.defaultAlert,
				});
                return;
            }
            this.changeModel(file);
        },
    }
}
</script>

<template>
    <div
        class="holder"
        :class="{'blur-[2px]': dragging && !model}"
        @dragenter="dragging = true"
        @dragleave="dragging = false"
        @drag="onChangeFile"
    >
        <div class="flex items-center">
            <Icon class="icon" :name="model ? 'draft' : 'note_add'" />
            <Icon class="delete-icon" v-if="model" name="delete" @click="changeModel(null)" />
        </div>
        <div class="flex flex-col items-center gap-2" v-if="!model">
            <h1 class="font-bold">Selecione um arquivo</h1>
            <p>ou arraste-o e solte-o aqui</p>
        </div>
        <p class="truncate" v-else>
            {{ model.name }}
        </p>
        <input
            v-if="!model"
            type="file"
            class="w-full h-full top-0 left-0 right-0 bottom-0 absolute opacity-0 z-20 cursor-pointer"
            @change="onChangeFile" 
        />
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.holder {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5em;
    color: $gray-500;
    padding: 1em;
    border: .1em $gray-400 dashed;
    border-radius: 8px;
}

.icon {
    font-size: 100px;
}

.delete-icon {
    @apply cursor-pointer;

    &:hover {
        color: $red-strong;
    }
}
</style>