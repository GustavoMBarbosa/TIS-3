<script>
import Icon from "@/components/Icon.vue";
import Card from "@/components/Card.vue";
import { formatCurrency } from "@/util";

export default {
	name: "Totals",
    props: {
        totals: Object,
        loading: Boolean,
        isCompare: Boolean,
    },
	components: { Icon, Card },

    setup() {
        return {
            formatCurrency
        }
    },

    methods: {
        getIcon(value) {
            if (!value) return 'remove';
            else if (value > 0) return 'arrow_drop_up';
            return 'arrow_drop_down';
        }
    }
}
</script>

<template>
    <div class="flex flex-wrap gap-4 [&>*]:w-full">
        <Card v-for="total in totals" class="total-card">
            <div class="skeleton skeleton-card-title" v-if="loading" />
            <h6 class="flex item-center gap-1" v-else>
                {{ total.name }}
                <span
                    v-if="isCompare"
                    class="flex items-center text-sm"
                    :class="{
                        'text-yellow-500': !total.percentage, 
                        'text-green-500' : total.percentage > 0, 
                        'text-red-500': total.percentage < 0
                    }"
                >
                    <Icon :name="getIcon(total.percentage)" class="text-2xl" />
                    {{ (total.percentage || 0).toFixed(2) }}%
                </span>
            </h6>
            <div class="skeleton skeleton-card-content" v-if="loading" />
            <p :class="total.value" v-else>{{ formatCurrency(total.total) }}</p>
        </Card>
    </div>
</template>

<style scoped lang="scss">
@import "../../../style/var.scss";

.total-card {
    flex: 1;
    min-width: 300px;

    h6 {
        font-weight: bold;
        font-size: 20px;
        color: $gray-500;
    }

    p {
        font-weight: bold;
        font-size: 26px;
    }
}

.profit {
    color: $green-strong;
}

.costs {
    color: $red-strong;
}

.roi {
    color: $blue-strong;
}
</style>