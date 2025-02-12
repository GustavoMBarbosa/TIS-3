<script>
export default {
    name: 'Card',
}
</script>

<template>
    <div class="card">
        <slot />
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.card {
    height: fit-content;
    background: white;
    box-shadow: $shadow-base;
    border-radius: 16px;
    padding: 1em;
}
</style>