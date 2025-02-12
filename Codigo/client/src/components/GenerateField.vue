<template>
    <Checkbox
        v-if="field.control" 
        v-model="model"
        @update:model-value="changeModel"
    >
        {{ field.label }}
    </Checkbox>
    <Checkbox
        v-else-if="isTypeValid(field, 'boolean')" 
        v-model="model"
        @update:model-value="changeModel"
    >
        {{ field.label }}
    </Checkbox>
    <Select
        v-else-if="field.options && canShow(field)"
        class="w-full"
        @update:model-value="updateSelect"
        :items="field.options"
        :label="field.label"
    >
        Selecione
    </Select>
    <DatePicker
        v-else-if="isTypeValid(field, 'date') && canShow(field)"
        label="Selecione a data"
        @update:model-value="changeModel"
        v-model="model"
    />
    <Input
        v-else-if="canShow(field)"
        @update:model-value="changeModel"
        :type="field.type"
        :label="field.label"
        v-model="model"
        placeholder="Digite aqui"
    />
</template>

<script>
import { ref } from "vue";
import Input from "@/components/Input.vue";
import Checkbox from "@/components/Checkbox.vue";
import Select from "@/components/Select.vue";
import DatePicker from "@/components/DatePicker.vue";

export default {
    name: "GenerateField",
    props: {
        modelValue: {
            type: Object,
            default: null
        },
        controlVars: {
            type: Object,
            default: {}
        },
        field: {
            type: Object,
            default: {}
        },
    },
    components: { Input, Checkbox, Select, DatePicker },
    emits: ['update:modelValue'],
    inject: ["Auth"],

    setup() {
        const model = ref({});

        return {
            model,
        }
    },

    watch: {
        modelValue() {
            this.model = this.modelValue;
        }
    },

    async created() {
        this.model = this.modelValue;
    },

    methods: {
        isTypeValid(field, valid) {
            return field.type == valid;
        },

        canShow(field) {
            return !field.controlValue || (field.controlValue && this.controlVars[field.controlValue]);
        },

        changeModel(value) {
            this.$emit('update:modelValue', value);
        },

        updateSelect(item) {
            this.model = typeof item == 'object' ? item.value : item;
            this.changeModel(this.model);
        },
    },
};
</script>


<style lang="scss" scoped>
@import "../style/var.scss";

.selecionar-data {
    margin-top: 1em;
    margin-bottom: 1em;
}

.card {
    margin-bottom: 1%;
}
</style>