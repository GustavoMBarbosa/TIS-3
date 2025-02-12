<script>
import { ref } from 'vue';
import event from "@/util/event";
import Dialog from './Dialog.vue';
import Button from './Button.vue';

export default {
    name: 'Confirm',
    components: { Dialog, Button },
    setup() {
        return {
            title: ref(''),
            description: ref(''),
            confirmText: ref('Confirmar'),
            cancelText: ref('Cancelar'),
            show: ref(false),
            onConfirm: () => {},
            onCancel: () => {},

        }
    },

    mounted() {
        event.on('open-confirm', this.openDialog);
    },

    computed: {
        size() {
            return window.innerWidth > 352 ? 'medium' : 'small';
        }
    },

    methods: {
        handleConfirm() {
            this.show = false;
            event.emit('confirm');
        },

        handleCancel() {
            this.show = false;
            event.emit('cancel');
        },

        handleChange(value) {
            if (value) return;
            this.handleCancel();
        },

        openDialog(options) {
            Object.keys(options).forEach((key) => {
                this[key] = options[key];
            });

            this.show = true;
        },
    },

    beforeUnmount() {
        event.off('open-confirm', this.openDialog);
    },
}
</script>

<template>
    <Dialog v-model="show" class="confirm-dialog" @update:model-value="handleChange">
        <div class="flex flex-col xs:gap-6 gap-4 p-2 z-50 relative">
            <h1 class="xs:text-4xl text-2xl font-bold whitespace-normal break-words">{{ title }}</h1>
            <p class="xs:text-lg text-sm whitespace-normal break-words">{{ description }}</p>
            <div class="flex xs:flex-row flex-col justify-end gap-2">
                <Button only-border @click="handleCancel" :size="size">{{ cancelText }}</Button>
                <Button @click="handleConfirm" :size="size">{{ confirmText }}</Button>
            </div>
        </div>
    </Dialog>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.confirm-dialog.dialog-bg {
    z-index: 2000;
    @apply relative;
}

h1 {
    color: $green-dark;
}
</style>