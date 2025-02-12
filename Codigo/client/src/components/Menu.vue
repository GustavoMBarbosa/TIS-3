<script>
import { ref } from 'vue';
import cow from '../assets/cow-face.svg';
import Icon from './Icon.vue';

export default {
    name: 'Menu',
    components: { Icon },
    emits: ['update:isMenuOpened'],
    setup() {
        const isPhone = ref(window.innerWidth <= 768);
        const isExpanded = ref(!isPhone);
        const menu = ref();
        const options = ref([
            {
                text: 'Perfil',
                value: 'perfil',
                path: '/perfil',
                icon: 'account_circle',
            },
            {
                text: 'Gado',
                value: 'gado',
                path: '/gado',
                icon: cow,
                isImg: true,
            },
            {
                text: 'Finanças',
                value: 'financas',
                path: '/financas',
                icon: 'payments',
            },
            {
                text: 'Mão de Obra',
                value: 'mao-de-obra',
                path: '/mao-de-obra',
                icon: 'supervised_user_circle',
            },
        ]);

        return {
            isPhone,
            menu,
            isExpanded,
            options
        }
    },
    computed: {
        getMenuOption() {
            if (this.$route.path.includes('financas')) return 'financas';
            if (this.$route.path.includes('mao-de-obra')) return 'mao-de-obra';
            if (this.$route.path.includes('gado')) return 'gado';
            return 'perfil';
        }
    },
    beforeMount() {
        window.addEventListener('resize', this.handleResize);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        handleResize() {
            this.isPhone = window.innerWidth <= 768;
            if (this.isPhone) {
                this .menu.style.height = '0';
            } else {
                this .menu.style.height = '100vh';
            }
        },
        changeExpanded(value) {
            this.isExpanded = value;
            this.$emit('update:isMenuOpened', value)
        },
        changeHeight(value) {
            this.isExpanded = value;
            let height = '0';
            if (value) {
                const topbar = document.querySelector('.top-holder');
                const windowHeight = window.innerHeight;
                height = windowHeight - topbar.scrollHeight;
            }
            this.menu.style.height = `${height}px`;
        }
    }
}
</script>

<template>
    <div class="menu-holder" :class="{'closed': !isExpanded, 'mobile': isPhone}">
        <Icon
            class="menu-expand-icon top-3 left-4 fixed"
            :name="isExpanded ? 'close' : 'menu'"
            @click="changeHeight(!isExpanded)"
            v-if="isPhone"
        />
        <div class="menu" ref="menu" :class="{'closed': !isExpanded, 'mobile': isPhone}">
            <div class="flex flex-col justify-between h-full" ref="content">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2 mb-2" v-if="!isPhone">
                        <img src="../assets/logoCrescaConosco.svg" alt="logo cresça conosco" class="logo" />
                        <img src="../assets/crescaConoscoText.svg" alt="cresça conosco" class="logo-text" v-if="isExpanded" />
                    </div>
                    <router-link
                        @click="isPhone && changeHeight(!isExpanded)"
                        class="option"
                        :class="{'active': getMenuOption === option.value, 'justify-center': !isExpanded}"
                        v-for="option in options"
                        :key="option.value"
                        :to="option.path"
                    >
                        <img :src="option.icon" :alt="option.text + ' icon'" v-if="option.isImg" />
                        <Icon :name="option.icon" v-else />
                        <span v-if="isExpanded">{{ option.text }}</span>
                    </router-link>
                </div>
                <Icon
                    @click="changeExpanded(!isExpanded)"
                    name="chevron_right"
                    class="arrow"
                    :class="[isExpanded ? 'rotate-180' : ' ml-2']"
                    style="font-size: 50px;"
                    v-if="!isPhone"
                />
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.menu-holder {
    min-width: 260px;
    max-width: 260px;
    transition: min-width 0.5s ease, width 0.5s ease, max-width 0.5s ease;
}

.menu-holder.closed {
    min-width: 100px;
    max-width: 100px;
}

.menu-holder.mobile {
    min-width: 0px !important;
    max-width: 0px !important;
}

.menu {
    position: fixed;
    bottom: 0;
    left: 0;
    min-width: 260px;
    max-width: 260px;
    box-shadow: $shadow-menu;
    background: $green-light;
    padding: 1em;
    height: 100vh;
    overflow: hidden;
    user-select: none;
    transition: min-width 0.5s ease, width 0.5s ease, max-width 0.5s ease;
}

.menu.closed {
    min-width: 100px;
    max-width: 100px;
}

.menu.mobile {
    position: fixed;
    z-index: 90;
    bottom: 0;
    min-width: 100%;
    max-width: none;
    transition: height 0.5s ease;
}

.menu.mobile.closed {
    padding: 0em;
    height: 0;
}

.logo {
    height: 80px;
    width: 80px;
}

.logo-text {
    width: 120px;
}

.option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.3em 0.5em;
    border-radius: 16px;
    color: $green-dark;
    font-weight: 600;
    font-size: 22px;
    cursor: pointer;
    user-select: none;

    &:hover {
        color: $orange-strong;
        background: $orange-light;

        img {
            filter: invert(71%) sepia(93%) saturate(3265%) hue-rotate(1deg) brightness(97%) contrast(98%);
        }
    }

    img {
        width: 40px;
        filter: invert(22%) sepia(17%) saturate(2775%) hue-rotate(123deg) brightness(98%) contrast(102%);
    }
}

.option.active {
    background: $orange-strong;
    color: white;
    img {
        filter: invert(100%);
    }

    &:hover {
        background: $orange-strong;
        color: white;
        img {
            filter: invert(100%);
        }
    }
}

.material-symbols-rounded {
    font-size: 40px;
}

.arrow {
    @apply ease-in-out duration-300 cursor-pointer w-fit;
    color: $green-dark;
}

.menu-expand-icon {
    z-index: 90;
    color: $green-dark;
}
</style>
