<script>
import { ref } from 'vue';
import Icon from './Icon.vue';
import Checkbox from './Checkbox.vue';
import Card from './Card.vue';

export default {
    name: 'Filter',
    components: { Icon, Checkbox, Card },
    props: {
        modelValue: {
            type: Array,
            default: []
        },
    },
    emits: ['update:modelValue'],
    setup() {
        return {
            model: ref(false),
            openedIndex: ref(null),
        }
    },

    mounted() {
        this.model = this.modelValue;
    },

    watch: {
        modelValue() {
            this.model = this.modelValue;
        },
    },

    methods: {
        changeModel(value) {
            this.model = value;
            this.$emit('update:modelValue', this.model);
        },

        selectItem(index, cIndex) {
            if (cIndex != undefined || cIndex != null) {
                this.model[index].childs[cIndex].selected = !this.model[index].childs[cIndex].selected;
            } else {
                this.model[index].selected = !this.model[index].selected;
            }
            this.changeModel(this.model);
        },

        openItem(index) {
            if (this.openedIndex == index) this.openedIndex = null;
            else this.openedIndex = index;
        }
    }
}
</script>

<template>
    <Card class="filter-holder">
        <div v-for="(item, index) in model" :key="index" :class="{'pt-2': index == 0}">
            <div v-if="item.childs" class="have-childs-card" :class="{'opened': index == openedIndex}">
                <div class="text-card" :class="{'opened': index == openedIndex}" @click="openItem(index)">
                    {{ item.text }}
                    <Icon name="expand_more" class="transition duration-150 select-none" :class="{'rotate-180': index == openedIndex}" />
                </div>
                <div class="px-4 py-2 pb-4 flex flex-col gap-3">
                    <div class="cursor-pointer" v-for="(child, cIndex) in item.childs" :key="index + cIndex" @click="selectItem(index, cIndex)">
                        <Checkbox v-model="child.selected" class="pointer-events-none">{{ child.text }}</Checkbox>
                    </div>
                </div>
            </div>
            <div class="px-4 py-2 cursor-pointer" @click="selectItem(index)" v-else>
                <Checkbox v-model="item.selected" class="pointer-events-none">{{ item.text }}</Checkbox>
            </div>
        </div>
    </Card>
</template>


<style scoped lang="scss">
@import "../style/var.scss";

.filter-holder {
    @apply flex flex-col p-0 overflow-hidden divide-y-[.1em] divide-gray-100 min-w-[10em];
}

.have-childs-card {
    @apply flex flex-col gap-2 max-h-[41px] overflow-hidden;
    transition: max-height 0.2s ease;
}

.have-childs-card.opened {
    @apply max-h-[12em] overflow-auto;
}

.text-card {
    @apply flex py-2 px-4 justify-between items-center cursor-pointer sticky top-0 cursor-pointer bg-white;
    color: $gray-500;
    font-size: 16px;

    &:hover {
        background: $gray-200;
    }

    .material-symbols-rounded {
        font-size: 25px;
    }
}

.text-card.opened {
    color: $green-dark;
    background: $green-100;
}
</style>