<script>
// 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'gray'
export default {
    name: 'Tag',
    props: {
        text: String,
        color: {
            type: String,
            default: 'blue'
        },
    },
}
</script>

<template>
    <div class="tag" :class="color">
        <template v-if="text">{{ text }}</template>
        <slot />
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.tag {
    @apply py-2 px-4 rounded-[3em] text-base text-center font-bold w-fit flex justify-center;
}

.blue {
    color: $blue-strong;
    background: $blue-100;
}

.green {
    color: $green-strong;
    background: $green-light;
}

.yellow {
    color: $yellow-strong;
    background: $yellow-light;
}

.orange {
    color: $orange-strong;
    background: $orange-100;
}

.red {
    color: $red-strong;
    background: $red-light;
}

.gray {
    color: $gray-500;
    background: $gray-300;
}
</style>