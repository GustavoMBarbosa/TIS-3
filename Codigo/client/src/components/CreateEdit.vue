<template>
	<div class="flex justify-between items-center gap-2 mb-8">
		<h2 class="title">{{ title }}</h2>
	</div>
	<Tab v-model="tabIndex" :items="tabItems" v-if="!id" class="mb-6" />

	<div>
		<Card class="flex flex-col gap-4" v-if="tabIndex == 0">
			<template v-for="field in parsedFields">
				<div class="flex gap-6 flex-wrap items-end" v-if="Array.isArray(field)">
					<template v-for="item in field">
						<GenerateField
							v-if="item.control"
							v-model="controlVars[item.value]"
							:control-vars="controlVars"
							:field="item"
						/>
						<GenerateField
							v-model="data[item.value]"
							:control-vars="controlVars"
							:field="item"
							class="md:w-[48.9%] w-full"
						/>
					</template>
				</div>
				<GenerateField
					v-else-if="field.control"
					v-model="controlVars[field.value]"
					:control-vars="controlVars"
					:field="field"
				/>
				<GenerateField v-else v-model="data[field.value]" :control-vars="controlVars" :field="field" />
			</template>
		</Card>
		<ImportData
			v-model="fileData.headers"
			v-model:values="fileData.values"
			v-model:map="fileData.map"
			:options="options"
			v-else
		/>

		<div class="flex flex-row flex-wrap gap-2 justify-end mt-4">
			<Button class="only-border" :disabled="loading" @click="$router.push(`${returnTo}`)">Cancelar</Button>
			<Button @click="salvar" :loading="loading">{{ buttonText }}</Button>
		</div>
	</div>
</template>

<script>
import { ref } from 'vue';
import Button from '@/components/Button.vue';
import Dialog from '@/components/Dialog.vue';
import Card from '@/components/Card.vue';
import Tab from '@/components/Tab.vue';
import ImportData from '@/components/ImportData.vue';
import GenerateField from '@/components/GenerateField.vue';
import { upperCaseFirstLetter, checkValidImport } from '@/util';

export default {
	name: 'CreateEdit',
	props: {
		id: String | Number,
		value: String,
		returnTo: String,
		fields: {
			type: Array,
			default: [],
		},
		callback: Function,
		import: Function,
		get: Function,
	},
	components: { Button, Dialog, Card, Tab, GenerateField, ImportData },
	inject: ['Auth'],

	setup() {
		const data = ref({});
		const controlVars = ref({});
		const tabItems = ref([
			{
				text: 'Criação',
				icon: 'add_circle',
			},
			{
				text: 'Importação de Planilha',
				icon: 'swap_vert',
			},
		]);
		const tabIndex = ref(0);
		const defaultAlert = ref({
			top: true,
			right: true,
			timeout: 3500,
		});
		const loading = ref(false);
		const fileData = ref({
			map: false,
			headers: [],
			parsedHeaders: [],
			values: [],
			parsedValues: [],
		});

		return {
			data,
			controlVars,
			tabItems,
			tabIndex,
			defaultAlert,
			loading,
			fileData,
		};
	},

	computed: {
		title() {
			if (this.id) return this.data.nome || 'Editar ' + upperCaseFirstLetter(this.value);
			return 'Criar ' + upperCaseFirstLetter(this.value);
		},
		buttonText() {
			if (this.id) return 'Salvar';
			else if (this.tabIndex > 0) return 'Importar';
			return 'Criar';
		},
		errorMessage() {
			if (this.tabIndex > 0) return `importar arquivo`;
			return `salvar a ${this.value}`;
		},
		sucessMessage() {
			if (this.tabIndex > 0) return `Arquivo importado`;
			return `${upperCaseFirstLetter(this.value)} salva`;
		},
		parsedFields() {
			const parsedFields = {};
			this.fields.map((field) => {
				if (field.group) {
					if (!parsedFields[field.group]) parsedFields[field.group] = [];
					parsedFields[field.group].push(field);
				} else {
					parsedFields[field.value] = field;
				}
			});
			return Object.values(parsedFields);
		},
		options() {
			return this.fields.filter((field) => !field.control).map((field) => field.value);
		},
	},

	async created() {
		if (this.id) {
			try {
				const data = await this.get(Number(this.id));
				this.data = data?.data || data;
			} catch (e) {
				this.callAlert(`Erro ao requisitar a ${this.value}`);
			}
		}
	},

	methods: {
		async salvar() {
			const importError = this.isImportaValid();
			if ((!this.isValid() && this.tabIndex == 0) || (importError && this.tabIndex == 1)) {
				const message = importError || `Preencha todos os dados para salvar a ${this.value}`;
				this.callAlert(message);
				return;
			}

			this.loading = true;

			try {
				if (this.id) {
					await this.callback(this.id, this.data);
				} else if (this.tabIndex > 0) {
					await this.import({ headers: this.fileData.parsedHeaders, data: this.fileData.parsedValues });
				} else {
					await this.callback(this.data);
				}

				this.callAlert(`${this.sucessMessage} com sucesso`, { type: 'success' });
			} catch (e) {
				this.callAlert(`Erro ao ${this.errorMessage}. Tente novamente mais tarde`);
			} finally {
				this.loading = false;
				this.$router.push(`${this.returnTo}`);
			}
		},

		callAlert(message, extra = {}) {
			this.$alert({
				message: message,
				...extra,
				...this.defaultAlert,
			});
		},

		isValid() {
			let valid = true;
			this.fields
				.filter((field) => !field.control)
				.forEach((field) => {
					if (!valid) return;

					if (
						field.controlValue &&
						!this.controlVars[field.controlValue] &&
						field.default &&
						!this.data[field.value]
					)
						this.data[field.value] = field.default();

					if (field.required && (!this.data[field.value] && this.data[field.value] != 0)) valid = false;
				});

			return valid;
		},

		isImportaValid() {
			if (this.tabIndex == 0) return;
			const data = checkValidImport(
				this.fileData.headers,
				this.fileData.values,
				this.fileData.map,
				this.options,
				this.value
			);
			this.fileData.parsedHeaders = data.parsedHeaders;
			this.fileData.parsedValues = data.parsedValues;

			return data.message;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '../style/var.scss';

.selecionar-data {
	margin-top: 1em;
	margin-bottom: 1em;
}

.card {
	margin-bottom: 1%;
}
</style>