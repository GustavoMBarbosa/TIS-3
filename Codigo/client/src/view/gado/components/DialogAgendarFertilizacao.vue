<template>
	<Dialog v-model="model" @update:model-value="cancelar" no-overflow>
		<div class="dialog-div" :class="{ bigger: isDateOpened }">
			<div class="flex justify-between gap-8">
				<h1 class="title mt-0">Agendar fertilização da {{ animalData.nome }}</h1>
				<div class="close-dialog">
					<Icon name="close" @click="changeModel(false)" />
				</div>
			</div>
			<DatePicker label="Data" v-model="date" v-model:expanded="isDateOpened" :min-date="new Date()" />
			<div class="flex flex-row gap-4 justify-end">
				<Button @click="cancelar" only-border :disabled="loading">Cancelar</Button>
				<Button @click="salvarFertilizacao" :loading="loading">Agendar</Button>
			</div>
		</div>
	</Dialog>
</template>

<script>
import Dialog from '@/components/Dialog.vue';
import Card from '@/components/Card.vue';
import Tab from '@/components/Tab.vue';
import Select from '@/components/Select.vue';
import DatePicker from '@/components/DatePicker.vue';
import Button from '@/components/Button.vue';
import Icon from '@/components/Icon.vue';
import notificationController from '@/controller/notification';
import { formatDate } from '@/util';
import { ref } from 'vue';

export default {
	name: 'DialogAgendarFertilizacao',
	props: {
		animalData: { type: Object, required: true },
		modelValue: { type: Boolean, required: false }
	},
	emits: ['update:modelValue', 'change'],
	components: {
		Dialog,
		Card,
		Tab,
		Select,
		DatePicker,
		Button,
		Icon,
	},
	setup() {
		const defaultAlert = ref({
			top: true,
			right: true,
			timeout: 3500,
		});

		const date = ref(null);
		const isDateOpened = ref(false);

		return {
			model: ref(false),
			loading: ref(false),
			defaultAlert,
			isDateOpened,
			date,
		};
	},
	watch: {
		modelValue() {
			this.model = this.modelValue;
		},
	},

	mounted() {
		this.model = this.dialogModel;
	},

	methods: {
		changeModel(value) {
			this.model = value;
			this.$emit('update:modelValue', this.model);
		},
		cancelar() {
			this.changeModel(false);
			this.date = null;
		},

		async salvarFertilizacao() {
			if (!this.date) {
				this.showAlert('Insirar a data para agendar a fertilização', 'error');
			} else {
				this.loading = true;
				try {
					const oldNotification = await this.getOldNotification();

					if (oldNotification) {
						const result = await this.$confirm({
							title: 'Deseja mudar a data do agendamento?',
							description: `A fertlização da ${this.animalData.nome} já foi marcada para o dia ${formatDate(new Date(oldNotification.vencimento))}`
						});
						if (!result) return;
						await notificationController.updateNotification(oldNotification.id, this.date);
					} else {
						this.animalData.id = this.animalData.id_animal;
						await notificationController.createFertilizacaoNotification(this.date, this.animalData);
					}

					this.showAlert('Agendamento feito com sucesso', 'success')
				} catch (error) {
					this.showAlert('Error ao agendar fertilização. Tente novamente mais tarde', 'error');
				} finally {
					this.cancelar();
					this.$emit('change');
					this.loading = false;
				}
			}
		},

		showAlert(message, type) {
			this.$alert({
				message: message,
				type: type,
				...this.defaultAlert,
			});
		},

		async getOldNotification() {
			try {
				const { data } = await notificationController.getFertilizacaoNotification(this.animalData.id_animal);
				return data;
			} catch (e) {
				return null;
			}
		},
	},
};
</script>
<style scoped lang="scss">
@import '../../../style/var.scss';

.dialog-div {
	display: flex;
	flex-direction: column;
	height: fit-content;
	min-height: 240px;
	gap: 3em;
	padding: 1em;
	transition-duration: 1s;

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
}

.dialog-div.bigger {
	min-height: 90vh;
}

@media screen and (max-width: 768px) {
	.dialog-div {
		width: 90vw;
	}
}
</style>