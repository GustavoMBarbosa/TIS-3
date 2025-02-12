<script>
export default {
    name: 'Icon',
    props: {
        name: String,
    },
}
</script>

<template>
    <span class="material-symbols-rounded">
        {{ name }}
    </span>
</template>

<style scoped lang="scss">
@import "../style/var.scss";
</style>