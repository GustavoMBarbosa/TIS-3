<script>
import { ref } from 'vue';
import Icon from './Icon.vue';

export default {
    name: 'Table',
    components: { Icon },
    props: {
        headers: {
            type: Array,
            default: []
        },
        items: {
            type: Array,
            default: []
        },
        maxHeight: {
            type: String,
            default: "50vh",
        },
        options: Object,
        loading: Boolean,
    },

    setup() {
        return {
            sortDesc: ref({}),
            sortByName: ref(''),
        }
    },

    watch: {
        items() {
            this.setSort();
        }
    },
    
    created() {
        this.setSort();
    },

    methods: {
        sortBy(key, isDesc = false) {
            if (!this.items.length) return;
            this.sortByName = key;
            this.items.sort((a, b) => {
                const valueA = a[key];
                const valueB = b[key];

                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    const lowerA = valueA.toLowerCase();
                    const lowerB = valueB.toLowerCase();
                    return isDesc ? lowerA.localeCompare(lowerB) : lowerB.localeCompare(lowerA);
                }
                else if (typeof valueA === 'number' && typeof valueB === 'number') {
                    return isDesc ? valueA - valueB : valueB - valueA;
                }
                else if (valueA instanceof Date && valueB instanceof Date) {
                    return isDesc ? valueA.getTime() - valueB.getTime() : valueB.getTime() - valueA.getTime();
                }
                else {
                    const stringA = String(valueA);
                    const stringB = String(valueB);
                    const lowerA = stringA.toLowerCase();
                    const lowerB = stringB.toLowerCase();
                    return isDesc ? lowerA.localeCompare(lowerB) : lowerB.localeCompare(lowerA);
                }
            });
        },

        setSort() {
            if (this.options) {
                this.sortDesc[this.options.sortBy] = this.options.isDesc;
                this.sortBy(this.options.sortBy, this.options.isDesc);
            }
        }
    }
}
</script>

<template>
    <div class="table-holder overflow-auto" :style="{'max-height': maxHeight}">
        <table class="rounded-t-2xl" :class="{'overflow-hidden': !items.length && !loading}">
            <thead v-if="loading">
                <tr>
                    <th v-for="header in (headers.length || 3)" :key="header" class="skeleton-table-cell pointer-events-none">
                        <div class="skeleton-table-div" />
                    </th>
                    <th v-if="$slots.actions" class="skeleton-table-cell pointer-events-none">
                        <div class="skeleton-table-div" />
                    </th>
                </tr>
            </thead>
            <thead class="sticky bg-white top-0" v-else>
                <tr>
                    <th
                        v-for="header, index in headers"
                        :key="index"
                        class="cursor-pointer"
                        :class="{'pointer-events-none': !header.sortable}"
                        :style="{ width: header.width ? header.width : 'fit-content' }"
                        @click="sortBy(header.value, sortDesc[header.value] = !sortDesc[header.value])"
                    >
                        <div class="flex w-full items-center gap-2" :style="{'justify-content': header.align ? header.align : 'flex-start'}">
                            <p class="truncate">{{ header.text }}</p>
                            <span
                                v-if="header.sortable"
                                class="h-fit w-fit flex items-center transition-transform ease-in-out duration-300 icon"
                                :class="{'rotate-180': sortDesc[header.value], 'icon-active': header.value === sortByName}"
                            >
                                <Icon name="arrow_upward" class="text-xl" />
                            </span>
                        </div>
                    </th>
                    <th v-if="$slots.actions" class="pointer-events-none" />
                </tr>
            </thead>
            <tbody v-if="loading">
                <tr v-for="index in 6" :key="index">
                    <td v-for="header in (headers.length || 3)" :key="header" class="skeleton-table-cell">
                        <div class="skeleton-table-div" />
                    </td>
                    <td v-if="$slots.actions" class="skeleton-table-cell">
                        <div class="skeleton-table-div" />
                    </td>
                </tr>
            </tbody>
            <tbody v-else>
                <template v-for="item, index in items" :key="index">
                    <tr class="[&>*]:py-2 [&>*]:px-4">
                        <slot v-for="header in headers" :key="header.value" :name="header.value" :item="item" :index="index" />
                        <slot v-if="$slots.actions" name="actions" :item="item" :index="index" />
                    </tr>
                    <slot name="childs" :item="item" :index="index" v-if="item.expanded" />
                </template>

            </tbody>
        </table>
        <div class="empty" v-if="!items.length && !loading">
            <slot name="empty-state" />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.table-holder {
    position: relative;
    height: fit-content;
    width: 100%;
    box-shadow: $shadow-base;
    border-radius: 16px;
    max-height: 50vh;
    background: white;
}

.empty {
    @apply w-full h-full flex items-center justify-center py-[1em];
    border-bottom-right-radius: 16px;
    border-bottom-left-radius: 16px;
}

table {
    width: 100%;
    max-height: 50vh;

    tbody {
        @apply divide-y-[.1em] divide-stone-100 w-full;
    }

    thead {
        @apply border-b-[.1em] border-b-stone-100 w-full z-10;
        border-top-right-radius: 16px;
        border-top-left-radius: 16px;

        th {
            @apply py-[.7em] px-[1em];
            color: $gray-500;

            &:hover {
                background: $gray-200;
                .icon {
                    @apply opacity-100;
                }
            }

            .icon.icon-active {
                @apply opacity-100;
                color: $green-dark;
            }

            .icon {
                @apply opacity-0;
                color: $gray-500;
                transition: opacity 0.2s ease, transform 0.3s ease;
            }
        }
    }
}

.skeleton-table-cell {
    padding: 1em;
}

.skeleton-table-div {
    @apply w-full bg-gradient-to-r from-transparent via-white to-transparent;
    background-color: $gray-300;
    height: 14px;
    border-radius: 8px;
    background-size: 200% 100%;
    animation: moveBar 2s linear infinite;
}

@keyframes moveBar {
    0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}
</style>