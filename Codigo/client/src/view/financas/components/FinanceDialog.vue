<script>
import { ref } from 'vue';
import Button from '@/components/Button.vue';
import Checkbox from '@/components/Checkbox.vue';
import DatePicker from '@/components/DatePicker.vue';
import Dialog from '@/components/Dialog.vue';
import Icon from '@/components/Icon.vue';

export default {
	name: 'FinanceDialog',
	props: {
		modelValue: Boolean,
	},
	components: {
		Button,
		Dialog,
		DatePicker,
		Checkbox,
		Icon,
	},
	inject: ['Auth'],
	setup() {
		return {
			model: ref(false),
			isCompare: ref(false),
			isDateOpened: ref({
				range: false,
				compare: false,
			}),
			periods: ref({
				range: [],
				compare: [],
			}),
		};
	},
	emits: ['update:modelValue', 'generateReport'],
	watch: {
		modelValue() {
			this.model = this.modelValue;
		},
	},
	methods: {
		changeModel(value) {
			this.model = value;
			this.$emit('update:modelValue', this.model);
		},
		generateReport() {
			if (!this.isValid()) {
				this.$alert({
					message: 'Preencha todos os dados para gerar o relatório',
					top: true,
					right: true,
					timeout: 3500,
				});
				return;
			}

			this.$emit('generateReport', this.periods.range, this.periods.compare);
			this.periods.range = [];
			this.periods.compare = [];
			this.isCompare = false;
		},
		isValid() {
			return (
				this.periods.range.length == 2 &&
				(!this.isCompare || (this.isCompare && this.periods.compare.length == 2))
			);
		},
	},
};
</script>

<template>
	<Dialog v-model="model" @update:model-value="changeModel" no-overflow>
		<div class="dialog-div" :class="{ bigger: isDateOpened.range || isDateOpened.compare }">
			<div class="flex justify-between">
				<h1 class="title" style="margin: 0">Campos do relatório</h1>
				<div class="close-dialog">
					<Icon name="close" @click="changeModel(false)" />
				</div>
			</div>
			<div class="flex flex-wrap gap-4 w-full">
				<DatePicker
					v-model="periods.range"
					is-compare
					:max-date="new Date()"
					class="w-full"
					label="Período 1"
					v-model:expanded="isDateOpened.range"
				>
					Selecionar período
				</DatePicker>
				<DatePicker
					v-model="periods.compare"
					is-compare
					:max-date="new Date()"
					class="w-full"
					label="Período a Comparar"
					v-model:expanded="isDateOpened.compare"
					v-if="isCompare"
				>
					Selecionar período
				</DatePicker>
			</div>
			<Checkbox v-model="isCompare">Comparar dois perídos</Checkbox>
			<Button @click="generateReport" class="w-fit self-end"> Gerar </Button>
		</div>
	</Dialog>
</template>

<style scoped lang="scss">
@import '../../../style/var.scss';

.dialog-div {
	display: flex;
	flex-direction: column;
	gap: 2em;
	width: 60vw;
	min-height: 290px;
	padding: .5em;
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

@media screen and (max-width: 488px) {
	.filter-input {
		min-width: 100%;
	}
}
</style>
