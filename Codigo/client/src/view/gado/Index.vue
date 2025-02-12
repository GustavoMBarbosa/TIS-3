<template>
	<div class="flex flex-col w-full md:mt-[3em]">
		<div class="w-full flex flex-col gap-4">
			<div class="mb-6">
				<div class="flex flex-row w-full flex-wrap justify-between align-middle my-4 gap-4">
					<h2 class="title mt-0">Gado</h2>
					<div class="flex flex-row items-center gap-2 content-center">
						<Button @click="createDialog">Mais detalhes</Button>
						<router-link to="/gado/vaca">
							<Button>Adicionar</Button>
						</router-link>
					</div>
				</div>
				<div class="flex items-center justify-between gap-4 flex-wrap">
					<Input
						v-model="searchValue"
						:disabled="isLoading"
						type="search"
						class="filter-input"
						placeholder="Pesquisar"
					/>
					<div class="relative filter-holder" ref="filterCard">
						<Button class="filter-button" :disabled="isLoading" rounded @click="showFilter = true">
							<Icon name="filter_list" class="round-icon" />
						</Button>
						<Filter
							v-model="filterOptions"
							class="top-12 md:left-auto md:right-0 left-0 absolute z-50 filter"
							v-show="showFilter"
						/>
					</div>
				</div>
			</div>
			<Table
				:items="filteredData ? filteredData : gadoData"
				:headers="headers"
				class="w-full gado-table"
				:loading="isLoading"
			>
				<template #actions="{ item, index }">
					<td class="w-2 cursor-pointer action">
						<div class="icon-holder" @click="positionCard(item, index)">
							<Icon name="more_vert" @click="positionCard(item, index)" />
						</div>
						<Card
							:ref="'card' + index"
							class="fixed action-card"
							v-show="item.expanded"
							tabindex="0"
							@blur="item.expanded = false"
						>
							<router-link :to="`/gado/vaca/${item.id_animal}`">
								<div class="action-option">
									<Icon name="edit" />
									Editar
								</div>
							</router-link>
							<div
								class="action-option"
								:class="{ disabled: !getOptions(item.status).insemAvaliable }"
								@click="openInsemDialog(item.id_animal, null, true)"
							>
								<Icon name="vaccines" />
								Inseminar
							</div>
							<div
								class="action-option"
								:class="{ disabled: !getOptions(item.status).editGestacaoAvaliable }"
								@click="openInsemDialog(item.id_animal, item.id_gestacao)"
							>
								<Icon name="edit" />
								Editar Gestão Atual
							</div>
							<div
								class="action-option"
								:class="{ disabled: !getOptions(item.status).parirAvaliable }"
								@click="openParirDialog(item.id_animal, item.id_gestacao, true)"
							>
								<Icon name="heart_check" />
								Parir
							</div>
							<div class="action-option" @click="secarAnimal(item.id_animal)">
								<Icon name="menstrual_health" />
								Secar
							</div>
							<div class="action-option" @click="openAgendarDialog(item)">
								<Icon name="event" />
								Agendar Fertilização
							</div>
							<div class="action-option delete" @click="confirmDeletion(item.id_animal, index)">
								<Icon name="delete" />
								Deletar
							</div>
						</Card>
					</td>
				</template>
				<template #nome="{ item, index }">
					<td>
						{{ item.nome }}
					</td>
				</template>
				<template #dataInsem="{ item, index }">
					<td>
						{{ item.data_insem ? formatDate(new Date(item.data_insem)) : '-' }}
					</td>
				</template>
				<template #prevParto="{ item, index }">
					<td>
						{{ item.prev_parto ? formatDate(new Date(item.prev_parto)) : '-' }}
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
							<Icon name="arrow_upward" class="text-xl ml-2 opacity-0" />
						</div>
					</td>
				</template>
				<template #empty-state>
					<div class="empty-div">
						<Icon name="sentiment_dissatisfied" />
						<p>Sem dados para exibir</p>
					</div>
				</template>
			</Table>
			<DialogTable v-model="moreDetails" :allData="allData" :isDialogLoading="isDialogLoading" />
			<DialogParir
				v-model="showParirDialog"
				:isDialogLoading="isDialogLoading"
				:animalData="animalData"
				:isEdit="isEdit"
				@change="loadBaseData"
			/>
			<DialogInsem
				v-model="showInsemDialog"
				:animalData="animalData"
				:isDialogLoading="isDialogLoading"
				:isEdit="isEdit"
				@change="loadBaseData"
			/>
			<DialogAgendarFertilizacao
				v-model="showAgendarDialog"
				:animalData="animalData"
				:isDialogLoading="isDialogLoading"
				@change="loadBaseData"
			/>
		</div>
	</div>
</template>

<script>
import { useGado } from './composables/useGado.js';
import { formatDate } from '../../util';
import { useFilter } from './composables/useFilter.js';
import { ref } from 'vue';
import Table from '@/components/Table.vue';
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import Card from '@/components/Card.vue';
import Icon from '@/components/Icon.vue';
import Filter from '@/components/Filter.vue';
import Dialog from '@/components/Dialog.vue';
import Tag from '@/components/Tag.vue';
import Loader from '@/components/Loader.vue';
import DialogTable from './components/DialogTable.vue';
import DialogInsem from './components/DialogInsem.vue';
import DialogParir from './components/DialogParir.vue';
import DialogAgendarFertilizacao from './components/DialogAgendarFertilizacao.vue';
import animalController from '@/controller/animal';

export default {
	name: 'Gado',
	components: {
		Table,
		Button,
		Input,
		Dialog,
		DialogTable,
		DialogInsem,
		DialogParir,
		DialogAgendarFertilizacao,
		Card,
		Icon,
		Filter,
		Tag,
		Loader,
	},
	inject: ['Auth'],
	setup() {
		const {
			gadoData,
			allData,
			animalData,
			headersDialog,
			headers,
			isLoading,
			isDialogLoading,
			filterOptions,
			moreDetails,
			showInsemDialog,
			showParirDialog,
			showAgendarDialog,
			isEdit,
			loadBaseData,
			createDialog,
			openInsemDialog,
			openParirDialog,
			openAgendarDialog,
			parirAnimal,
			secarAnimal,
			deletarAnimal,
			confirmarGestacao,
			getOptions,
		} = useGado();

		const searchValue = ref('');
		const pageLoading = ref(false);
		const { filteredData, getSelected } = useFilter(gadoData, filterOptions, searchValue);
		const defaultAlert = ref({
			top: true,
			right: true,
			timeout: 3500,
		});
		return {
			gadoData,
			allData,
			animalData,
			headersDialog,
			headers,
			isLoading,
			isDialogLoading,
			filterOptions,
			moreDetails,
			showInsemDialog,
			showParirDialog,
			showAgendarDialog,
			filterOptions,
			filterCard: ref(),
			showFilter: ref(false),
			opendedIndex: ref(null),
			searchValue,
			filteredData,
			getSelected,
			defaultAlert,
			isEdit,
			loadBaseData,
			createDialog,
			openInsemDialog,
			openParirDialog,
			openAgendarDialog,
			formatDate,
			parirAnimal,
			secarAnimal,
			deletarAnimal,
			confirmarGestacao,
			getOptions,
			pageLoading,
		};
	},

	async beforeMount() {
		this.pageLoading = true;
		await this.loadBaseData();
		this.pageLoading = false;
	},

	mounted() {
		document.addEventListener('click', this.closeCards);
		const app = document.querySelector('#app');
		app.addEventListener('scroll', this.closeCard);
		const table = document.querySelector('.gado-table');
		table.addEventListener('scroll', this.closeCard);
	},

	beforeUnmount() {
		document.removeEventListener('click', this.closeCards);
		const app = document.querySelector('#app');
		app.removeEventListener('scroll', this.closeCard);
		const table = document.querySelector('.gado-table');
		table.removeEventListener('scroll', this.closeCard);
	},

	methods: {
		positionCard(item, index) {
			this.setExpanded();
			const card = this.$refs['card' + index]?.$el;
			const rect = card.parentElement.getBoundingClientRect();

			item.expanded = true;
			setTimeout(() => {
				const windowHeight = window.innerHeight;
				const cardHeight = card.offsetHeight;
				const height = rect.top + 40 + cardHeight;
				card.style.left = rect.left - 210 + 'px';
				if (height > windowHeight) {
					delete card.style.top;
					card.style.bottom = 0;
				} else {
					card.style.top = rect.top + 40 + 'px';
				}
			}, 10);

			this.opendedIndex = index;
		},

		closeCard(event) {
			const cardParent = this.$refs['card' + this.opendedIndex]?.$el?.parentElement;
			if (this.opendedIndex == null || (cardParent && event.target.closest('.action') === cardParent)) return;
			this.setExpanded();
		},

		closeCards(event) {
			this.closeCard(event);
			this.closeFilterCard(event);
		},

		closeFilterCard(event) {
			if (this.filterCard == event.target.closest('.filter-holder') || event.target.closest('.filter')) return;
			this.showFilter = false;
		},

		setExpanded() {
			const item = this.gadoData[this.opendedIndex];
			if (!item) return;
			item.expanded = false;
			this.opendedIndex = null;
		},

		async confirmDeletion(id, index) {
			const result = await this.$confirm({
				title: 'Tem certeza que deseja deletar esse item?',
			});
			if (result) {
				try {
					await animalController.deletarAnimal(id);
					this.gadoData.splice(index, 1);
					this.$alert({
						message: 'Vaca deletada com sucesso',
						type: 'success',
						...this.defaultAlert,
					});
				} catch (error) {
					this.$alert({
						message: 'Erro ao deletar a vaca. Tente novamente mais tarde',
						...this.defaultAlert,
					});
				}
			}
		},

		getColor(status) {
			switch (status) {
				case 'falhou':
					return 'red';
				case 'pendente':
					return 'yellow';
				case 'confirmada':
					return 'blue';
				case 'concluida':
					return 'green';
				default:
					return 'gray';
			}
		},
	},
};
</script>

<style lang="scss" scoped>
@import '../../style/var.scss';

td {
	color: $gray-500;
}

.icon-holder {
	display: flex;
	align-items: center;
	width: fit-content;
	border-radius: 50%;
	padding: 0.1em;
	cursor: pointer;
	color: $gray-500;
	transition-duration: 0.3s;

	&:hover {
		background: $gray-200;
	}

	.material-symbols-rounded {
		font-size: 30px;
	}
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
	@apply z-50 p-3 flex flex-col cursor-default gap-2;
}

.action-option {
	@apply flex items-center cursor-pointer gap-4 p-2 font-bold;
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

.action-option.disabled {
	@apply pointer-events-none;
	color: $gray-400;
	background: $gray-200;
}

@media screen and (max-width: 768px) {
	.dialog-div {
		width: 90vw;
	}
}

@media screen and (max-width: 488px) {
	.filter-input {
		min-width: 100%;
	}
}
</style>
