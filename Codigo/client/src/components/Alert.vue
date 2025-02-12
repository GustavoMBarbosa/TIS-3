<script>
import event from "@/util/event";
import { ref } from 'vue';
import Icon from './Icon.vue';

export default {
    name: 'Alert',
    components: { Icon },
    setup() {
        return {
            title: ref(''),
            message: ref(''),
            hidden: ref(true),
            show: ref(false),
            top: ref(false),
            bottom: ref(false),
            left: ref(false),
            right: ref(false),
            type: ref('error'),
        }
    },
    mounted() {
        event.on('show-alert', this.showAlert);
        event.on('close-alert', this.closeAlert);
    },
    beforeUnmount() {
        event.off('show-alert', this.showAlert);
        event.off('close-alert', this.closeAlert);
    },
    computed: {
        icon() {
            switch (this.type) {
                case 'error' || 'warning':
                    return 'error';
                case 'success':
                    return 'check_circle';
                case 'info':
                    return 'info';
            }
        }
    },
    methods: {
        showAlert(options) {
            Object.keys(options).forEach((key) => {
                this[key] = options[key];
            });

            this.show = true;
            setTimeout(() => {
                this.hidden = false;
            }, 1);
        },

        closeAlert() {
            this.hidden = true;
            setTimeout(() => {
                this.show = false;
            }, 600);
        }
    },
}
</script>

<template>
    <div   
        v-if="show"
        class="alert"
        :class="[type, {'top-3': top, 'bottom-3': bottom, 'left': left, 'right': right, 'hidden': hidden}]"
    >
        <div class="flex gap-2 items-center">
            <Icon class="text-2xl" :name="icon" />
            <div>
                <h6 v-if="title" class="font-bold text-lg">{{ title }}</h6>
                <p class="text-base">{{ message }}</p>
            </div>
        </div>
        <Icon class="cursor-pointer text-2xl" name="close" @click="closeAlert" />
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.alert {
    z-index: 1001;
    position: fixed;
    display: flex;
    gap: 0.5em;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 0.7em;
    border-radius: 16px;
    white-space: normal;
    width: fit-content;
    max-width: 50em;
    border-width: 0.1em;
    transition: left 0.6s ease, right 0.6s ease;
}

.alert.hidden.right {
    right: -100%;
}

.alert.hidden.left {
    left: -100%;
}

.right {
    right: 1em;
}

.left {
    left: 1em;
}

@media screen and (max-width: 50em) {
    .alert {
        max-width: 95%;
    }
}


.icon {
    font-size: 40px;
}

.error {
    color: $red-strong;
    border-color: $red-strong;
    background: $red-light;
}

.warning {
    color: $yellow-strong;
    border-color: $yellow-strong;
    background: $yellow-light;
}

.success {
    color: $green-strong;
    border-color: $green-strong;
    background: $green-light;
}

.info {
    color: $blue-strong;
    border-color: $blue-strong;
    background: $blue-100;
}
</style>