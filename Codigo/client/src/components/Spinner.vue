<script>
export default {
    name: 'Spinner',
}
</script>

<template>
    <svg class="spinner" viewBox="0 0 50 50">
        <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="8" shape-rendering="geometricPrecision"></circle>
    </svg>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.spinner {
    @apply inline-block w-[1.5em] h-[1.5em];
    animation: rotate 2s linear infinite;
}

.path {
    @apply stroke-current;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>