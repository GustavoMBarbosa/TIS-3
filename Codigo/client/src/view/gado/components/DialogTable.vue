<template>
	<Dialog v-model="model" @update:model-value="cancelar" width="100%" no-overflow>
		<div>
			<!-- Dialog header components -->
			<div class="flex flex-col gap-2">
				<div class="flex flex-row gap-4 justify-between my-4">
					<h1 class="title mt-0">Mais Detalhes</h1>
					<div class="close-dialog">
						<Icon name="close" @click="changeModel(false)" />
					</div>
				</div>
				<div class="flex flex-row flex-wrap gap-4 justify-between mb-4">
					<Input v-model="searchValue" type="search" placeholder="Pesquisar" class="filter-input" />
					<div class="relative filter-holder" ref="filterCard">
						<Button class="filter-button" rounded @click="showFilter = true">
							<Icon name="filter_list" class="round-icon" />
						</Button>
						<Filter v-model="filterOptions" class="top-12 md:left-auto md:right-0 left-0 absolute z-50 filter" v-show="showFilter" />
					</div>
				</div>
			</div>
			<!-- Dialog body components -->
			<Table
				:items="filteredData"
				:headers="headersDialog"
				maxHeight="50vh"
				class="w-full"
				:loading="isDialogLoading"
			>
				<template #nome="{ item, index }">
					<td>
						{{ item.nome }}
					</td>
				</template>
				<template #crias="{ item, index }">
					<td class="text-center">
						{{ item.crias || 0 }}
						<Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
					</td>
				</template>
				<template #dataInsem="{ item, index }">
					<td>
						{{ item.data_insem ? formatDateString(item.data_insem) : '-' }}
					</td>
				</template>
				<template #dpia="{ item, index }">
					<td>
						{{ item.data_insem ? calculateDaysInsem(item.data_insem) : '-' }}
					</td>
				</template>
				<template #prevParto="{ item, index }">
					<td>
						{{ item.prev_parto ? formatDateString(item.prev_parto) : '-' }}
					</td>
				</template>
				<template #touro="{ item, index }">
					<td class="text-center">
						{{ item.touro }}
						<Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
					</td>
				</template>
				<template #lactante="{ item, index }">
					<td class="text-center">
						<Icon
							:name="item.lactante ? 'done' : 'close'"
							:class="item.lactante ? 'text-green-500' : 'text-red-500'"
						/>
						<Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
					</td>
				</template>
				<template #status="{ item, index }">
					<td>
						<div class="flex justify-center">
							<Tag :color="getColor(item.status)" :text="item.status || 'Não inseminada'" />
						</div>
					</td>
				</template>
				<template #secarEm="{ item, index }">
					<td>
						{{ item.prev_parto ? formatDateString(calculateSecar(item.prev_parto)) : '-' }}
					</td>
				</template>
				<template #empty-state>
					<div class="empty-div">
						<Icon name="sentiment_dissatisfied" />
						<p>Sem dados para exibir</p>
					</div>
				</template>
			</Table>
		</div>
	</Dialog>
</template>

<script>
import Table from '@/components/Table.vue';
import Icon from '@/components/Icon.vue';
import Tag from '@/components/Tag.vue';
import Dialog from '@/components/Dialog.vue';
import Filter from '@/components/Filter.vue';
import Input from '@/components/Input.vue';
import Button from '@/components/Button.vue';
import { getColor, formatDateString, calculateDaysInsem, calculateSecar } from '@/util/index';
import GadoReport from './GadoReport.vue';
import { useGado } from '../composables/useGado';
import { ref } from 'vue';
import { useFilter } from '../composables/useFilter';

export default {
	name: 'DialogTable',
	props: {
		allData: {
			type: Array,
			required: true,
		},
		isDialogLoading: {
			type: Boolean,
			required: true,
		},
	},
	components: {
		Table,
		Icon,
		Tag,
		Dialog,
		Filter,
		Input,
		Button,
		GadoReport,
	},
	setup() {
		const searchValue = ref('');
		const data = ref([]);
		const { headersDialog, filterOptions } = useGado();
		const { getSelected, filteredData } = useFilter(data, filterOptions, searchValue);

		return {
			showFilter: ref(false),
			filterCard: ref(),
			headersDialog,
			searchValue,
			getColor,
			formatDateString,
			calculateDaysInsem,
			getSelected,
			filterOptions,
			filteredData,
			data,
			calculateSecar,
		};
	},

	watch: {
		allData() {
			this.data = this.allData;
		},
	},

	created() {
		this.data = this.allData;
	},

	mounted() {
		document.addEventListener('click', this.closeFilterCard);
	},

	beforeUnmount() {
		document.removeEventListener('click', this.closeFilterCard);
	},

	methods: {
		closeFilterCard(event) {
			if (this.filterCard == event.target.closest('.filter-holder') || event.target.closest('.filter')) return;
			this.showFilter = false;
		},
		changeModel(value) {
			this.model = value;
			this.$emit('update:modelValue', this.model); // Emitindo o evento
		},
		cancelar() {
			this.changeModel(false);
		},
	},
};
</script>

<style scoped lang="scss">
@import '../../../style/var.scss';

td {
	color: $gray-500;
}

.close-dialog {
	display: flex;
	align-items: center;
	border-radius: 50%;
	padding: 0.1em 0.2em;
	cursor: pointer;
	color: $green-dark;
	transition-duration: 0.3s;

	&:hover {
		background: $gray-200;
	}

	.material-symbols-rounded {
		font-size: 35px;
	}
}

.empty-div {
	@apply flex flex-col items-center justify-center gap-4 p-4;
	color: $gray-400;

	.material-symbols-rounded {
		font-size: 100px;
	}
}

.close-button {
	font-size: 30px;
}
</style>
