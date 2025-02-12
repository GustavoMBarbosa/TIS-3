<script>
import { ref } from "vue";
import Card from "./Card.vue";
import Input from "./Input.vue";
import Checkbox from "./Checkbox.vue";
import Select from "./Select.vue";
import Icon from "./Icon.vue";
import File from "./File.vue";
import Button from "./Button.vue";
import { parseFile } from "@/util";

export default {
    name: "ImportData",
    props: {
        modelValue: Object,
        options: Array,
        values: Array,
        map: Boolean,
    },
    emits: ['update:modelValue', 'update:values', 'update:map'],
    components: { Card, Input, Checkbox, Select, File, Icon, Button },
    inject: ["Auth"],

    setup() {
        const file = ref(null);
        const headers = ref([]);
        const deletedHeaders = ref([]);
        const mapData = ref(false);
        const isHeader = ref(true);
        const parsedFile = ref();

        return {
            file,
            headers,
            mapData,
            deletedHeaders,
            isHeader,
            parsedFile,
        }
    },

    mounted() {
        document.addEventListener('keydown', this.detectCtrlZ);
    },

    beforeUnmount() {
        document.removeEventListener('keydown', this.detectCtrlZ);
    },

    methods: {
        async changeModel(file) {
            if (!file) return;

            const parsedFile = await parseFile(file);
            this.parsedFile = parsedFile;
            this.parseHeader();
        },

        changeMap(value) {
            this.mapData = value;
            this.$emit('update:map', value);
        },

        changeHeader(value) {
            if (!value) this.changeMap(true);
            this.parseHeader(value);
        },

        deleteHeader(index) {
            this.headers[index].map = false;
            this.headers[index].to = '';
            this.deletedHeaders.unshift(index);
            this.$emit('update:modelValue', this.headers);
        },

        addHeader() {
            if (!this.deletedHeaders.length) return;
            const index = this.deletedHeaders[0];
            this.headers[index].map = true;
            this.deletedHeaders.splice(0, 1);
            this.$emit('update:modelValue', this.headers);
        },

        selectOption(value, from) {
            const index = this.headers.findIndex((header) => header.from == from);
        
            this.headers.forEach((header, i) => {
                if (header.to == value && i != index) header.to = '';
            });
    
            this.$emit('update:modelValue', this.headers);
        },

        detectCtrlZ(event) {
            if ((event.ctrlKey || event.metaKey) && event.key == 'z') this.addHeader();
        },

        parseHeader(isFirstHeader = true) {
            const parsedFile = JSON.parse(JSON.stringify(this.parsedFile));

            this.headers = parsedFile[0].map((header, index) => {
                return {
                    from: isFirstHeader ? header : ('Coluna ' + (index + 1)),
                    map: true,
                    to: this.options.find((option) => header == option) || '',
                };
            });
            if (isFirstHeader) parsedFile.splice(0, 1);
            const values = [...parsedFile];

            this.$emit('update:modelValue', this.headers);
            this.$emit('update:values', values);
        }
    },
};
</script>

<template>
    <Card class="flex flex-col gap-4 mb-4">
        <File v-model="file" @update:model-value="changeModel" />
        <div class="flex gap-4" v-if="file">
            <Checkbox v-model="isHeader" @update:model-value="changeHeader">Primeira linha é cabeçalho</Checkbox>
            <Checkbox v-model="mapData" :disabled="!isHeader" @update:model-value="changeMap">Mapear dados</Checkbox>
        </div>
        <template v-if="mapData && file">
            <div v-for="(header, index) in headers.filter((h) => h.map)" :key="index" class="flex items-center gap-4">
                <Input class="flex-1" v-model="header.from" disabled />
                <Icon class="arrow-icon" name="arrow_forward" />
                <Select class="flex-1" v-model="header.to" :items="options" @update:model-value="(value) => { selectOption(value, header.from); }" />
                <Icon class="delete-icon" name="delete" @click="deleteHeader(headers.findIndex((h) => h.from == header.from))" />
            </div>
            <div v-if="deletedHeaders.length">
                <Button rounded @click="addHeader">
                    <Icon name="add" />
                </Button>
            </div>
        </template>
    </Card>
</template>


<style lang="scss" scoped>
@import "../style/var.scss";

.arrow-icon {
    color: $green-dark;
}

.delete-icon {
    @apply cursor-pointer;
    color: $gray-500;

    &:hover {
        color: $red-strong;
    }
}
</style>