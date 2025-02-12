<script>
import { ref } from "vue";
import Table from "@/components/Table.vue";
import Button from "@/components/Button.vue";
import Input from "@/components/Input.vue";
import Icon from "@/components/Icon.vue";
import DatePicker from "@/components/DatePicker.vue";
import Card from "@/components/Card.vue";
import { formatCurrency, formatDate, upperCaseFirstLetter, csvExport } from "@/util";

export default {
	name: "GenericTable",
    props: {
        items: Array,
        headers: Array,
        loading: Boolean,
        title: String,
        type: String,
        addRoute: String,
    },
	components: { Table, Button, Input, DatePicker, Icon, Card },
    emits: ['filterData', 'deleteItem'],
    inject: ["Auth"],
	setup() {
		const defaultAlert = ref({
			top: true,
			right: true,
			timeout: 3500,
		});

		return {
            searchValue: ref(''),
			opendedIndex: ref(null),
			opendedChildIndex: ref(null),
            filteredDate: ref([]),
			expandedDate: ref(null),
            formatCurrency,
            formatDate,
            upperCaseFirstLetter,
            defaultAlert,
		};
	},
    
	mounted() {
		document.addEventListener('click', this.closeCard);
        const app = document.querySelector('#app');
		app.addEventListener('scroll', this.closeCard);
		const table = document.querySelector('.finance-table');
		table.addEventListener('scroll', this.closeCard);
	},

	beforeUnmount() {
		document.removeEventListener('click', this.closeCard);
        const app = document.querySelector('#app');
		app.removeEventListener('scroll', this.closeCard);
		const table = document.querySelector('.finance-table');
		table.removeEventListener('scroll', this.closeCard);
	},

    computed: {
        filteredData() {
            if (!this.searchValue) return this.items;
            return this.items.filter((item) => {
                return Object.values(item).some((value) => {
                    const stringValue = String(value);
                    return stringValue.includes(this.searchValue);
                });
            });
        },
    },

    methods: {
        positionCard(item, index, cIndex) {
			this.setExpanded();
			const card = this.$refs['card' + index + cIndex][0]?.$el
			const rect = card?.parentElement?.getBoundingClientRect();

            if (!card || !rect) return;

			item.expanded = true;
            setTimeout(() => {
                const windowHeight = window.innerHeight;
                const cardHeight = card.offsetHeight;
                const height = rect.top + 40 + cardHeight;
                card.style.left = rect.left - 100 + 'px';
                if (height > windowHeight) {
                    delete card.style.top;
                    card.style.bottom = 0;
                } else {
                    card.style.top = rect.top + 40 + 'px';
                }
            }, 10);
			this.opendedIndex = index;
			this.opendedChildIndex = cIndex;
		},

		closeCard(event) {
            this.isFilterExpanded = false;
			const card = this.$refs['card' + this.opendedIndex + this.opendedChildIndex];
            if (!card) return;
            const cardParent = card[0]?.$el?.parentElement;
			if (this.opendedIndex == null || this.opendedChildIndex == null || (cardParent && event.target.closest('.actions') === cardParent)) return;
			this.setExpanded();
		},

		setExpanded() {
            if (this.opendedIndex == null || this.opendedChildIndex == null) return;

			const item = this.filteredData[this.opendedIndex]?.childs[this.opendedChildIndex];
			if (!item) return;
			item.expanded = false;
			this.opendedIndex = null;
			this.opendedChildIndex = null;
		},

        async filterDate() {
            if (this.filteredDate.length > 1 || !this.filteredDate.length) {
                this.expandedDate = false;
                await this.$emit('filterData', this.filteredDate, this.type)
            }
        },

        async confirmDeletion(item, childIndex, id) {
            const result = await this.$confirm({
                title: 'Tem certeza que deseja deletar esse item?'
            });
            if (result) await this.$emit('deleteItem', item, childIndex, id, this.type);
        },

        downloadCSV() {
            try {
                const exportData = [];
                this.filteredData.forEach((item) => {
                    exportData.push(...item.childs)
                });
                csvExport(exportData, `${this.title.toLowerCase()}-${formatDate(new Date())}`);
            } catch (e) {
                this.$alert({
                    message: `Erro ao baixar o arquivo de ${this.title.toLowerCase()}. Tente novamente mais tarde`,
                    ...this.defaultAlert,
                });
            }
        },
    },
};
</script>

<template>
    <div class="flex flex-col gap-6 mt-12">
        <div class="flex items-center gap-4">
            <h1 class="title" style="margin: 0;">{{ title }}</h1>
            <router-link :to="addRoute" :class="{'pointer-events-none': loading}">
                <Button rounded :disabled="loading">
                    <Icon name="add" />
                </Button>
            </router-link>
        </div>
        <div class="flex items-center justify-between gap-4 flex-wrap">
            <Input v-model="searchValue" type="search" class="filter-input" placeholder="Pesquisar" :disabled="loading" />
            <DatePicker
                v-model="filteredDate"
                v-model:expanded="expandedDate"
                @update:model-value="filterDate"
                is-compare
                :disabled="loading"
                :max-date="new Date()"
            >
                Filtro por data
            </DatePicker>
        </div>
        <Table :headers="headers" :items="filteredData" :loading="loading" class="finance-table">
            <template v-for="(header, index) in headers" :key="index" v-slot:[header.value]="{ item }">
                <td v-if="header.value == 'data' && item[header.value]">
                    {{ upperCaseFirstLetter(formatDate(new Date(item[header.value]), { month: 'long' })) }}/{{ formatDate(new Date(item[header.value]), { year: 'numeric' }) }}
                </td>
                <td v-else-if="header.value == 'none'" class="w-2">
                    <div class="icon-holder relative z-0" :class="{'rotate-180': item.expanded}" @click="item.expanded = !item.expanded">
                        <Icon name="arrow_drop_down" />
                    </div>
                </td>
                <td v-else-if="typeof Number(item[header.value]) == 'number'" class="text-center">
                    <div class="flex items-center justify-center">
                        {{ formatCurrency(item[header.value]) }}
                        <Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
                    </div>
                </td>
                <td v-else>{{ item[header.value] }}</td>
            </template>
            <template #actions></template>
            <template #childs="{ item, index }">
                <tr
                    v-for="(child, cIndex) in item.childs"
                    :key="cIndex"
                    class="child-tr"
                >
                    <td
                        v-for="(header, hIndex) in headers"
                        :key="hIndex"
                        class="border-gray-200 border-t-[.1em]"
                        :class="{'text-center': header.value != 'data'}"
                    >
                        <template v-if="child.tipo == header.value">
                            <Icon name="check" class="text-green-500" />
                            <Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
                        </template>
                        <template v-else-if="header.value == 'total' && typeof child.valor == 'number'">
                            <div class="flex items-center justify-center">
                                {{ formatCurrency(child.valor) }}
                                <Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
                            </div>
                        </template>
                        <template v-else>
                            {{ child[header.value] }}
                        </template>
                    </td>
                    <td class="border-gray-200 border-t-[.1em] w-2 actions">
                        <div class="icon-holder action" @click="positionCard(child, index, cIndex)">
                            <Icon name="more_vert" />
                        </div>
						<Card
							:ref="'card' + index + cIndex"
							class="fixed action-card"
							v-show="child.expanded"
							tabindex="0"
							@blur="child.expanded = false"
						>
							<router-link :to="`${addRoute}/${child.id}`">
                                <div class="action-option">
                                    <Icon name="edit" />
                                    Editar
                                </div>
                            </router-link>
							<div class="action-option delete" @click="confirmDeletion(item, cIndex, child.id)">
                                <Icon name="delete" />
                                Deletar
                            </div>
						</Card>
                    </td>
                </tr>
            </template>
            <template #empty-state>
                <div class="empty-div">
                    <Icon name="sentiment_dissatisfied" />
                    <p>Sem dados para exibir</p>
                </div>
            </template>
        </Table>
        <Button class="self-end" @click="downloadCSV">Download</Button>
    </div>
</template>

<style scoped lang="scss">
@import "../../../style/var.scss";

td {
    color: $gray-500;
}

.icon-holder {
    display: flex;
    align-items: center;
    width: fit-content;
    border-radius: 50%;
    padding: 0.1em 0.15em;
    cursor: pointer;
    color: $gray-500;
    transition-duration: 0.3s;

    &:hover {
        background: $gray-200;
    }

    .material-symbols-rounded {
        font-size: 35px;
    }
}

.icon-holder.action {
    &:hover {
        background: $gray-300;
    }

    .material-symbols-rounded {
        font-size: 30px;
    }
}

.child-tr {
    @apply [&>*]:py-2 [&>*]:px-4;
    background: $gray-200;
}

.filter-button .material-symbols-rounded {
    font-size: 30px;
}

.filter-input {
    min-width: 25em;
}

.empty-div {
    @apply flex flex-col items-center justify-center gap-4 p-4;
    color: $gray-400;

    .material-symbols-rounded {
        font-size: 100px;
    }
}

.action-card {
    @apply p-3 flex flex-col gap-2;
}

.action-option {
    @apply flex items-center gap-4 cursor-pointer p-2 font-bold;
    color: $gray-500;
    border-radius: 8px;
    
    &:hover {
        background: $gray-200;
    }
}

.action-option.delete {
    color: $red-strong;
    
    &:hover {
        background: $red-light;
    }
}

@media screen and (max-width: 488px) {
    .filter-input {
        min-width: 100%;
    }
}
</style>
