<script>
import VueApexCharts from 'vue3-apexcharts';
import { formatCurrency, formatDate } from '../../util';
import { ref } from 'vue';
import Icon from '@/components/Icon.vue';
import Card from '@/components/Card.vue';
import Button from '@/components/Button.vue';
import profitController from '@/controller/profit';
import costController from '@/controller/cost';
import financeController from '@/controller/finance';
import FinanceDialog from './components/FinanceDialog.vue';
import GenericTable from './components/GenericTable.vue';
import Totals from './components/Totals.vue';

export default {
	name: 'Finance',
	components: { Card, Button, Icon, FinanceDialog, GenericTable, Totals, apexchart: VueApexCharts },
	inject: ['Auth'],
	setup() {
		const chartColors = ['#23b73c', '#ed0000', '#0973f5', '#23b772', '#ed002b', '#09aaf5'];
		const isCompare = ref(false);
		const series = ref([]);
		const totals = ref({
			receita: {
				name: 'Receita',
				value: 'profit',
				total: 0,
			},
			despesas: {
				name: 'Despesas',
				value: 'costs',
				total: 0,
			},
			roi: {
				name: 'ROI',
				value: 'roi',
				total: 0,
			},
		});
		const showDialog = ref(false);
		const loading = ref({
			report: false,
			profit: false,
			costs: false,
		});
		const defaultAlert = ref({
			top: true,
			right: true,
			timeout: 3500,
		});
		const data = ref({
			profit: [],
			cost: [],
		});
		const categories = ref([]);
		const overwriteCategories = ref([]);

		return {
			series,
			totals,
			isCompare,
			chartColors,
			showDialog,
			loading,
			defaultAlert,
			data,
			categories,
			overwriteCategories,
			formatCurrency,
		};
	},

	computed: {
		chartOptions() {
			return {
				chart: {
					id: 'vuechart-example',
					stacked: false,
				},
				stroke: {
					width: 4,
				},
				markers: {
					size: 0,
				},
                legend: {
      				show: true,
                    offsetY: 15,
      				position: 'bottom',
                    itemMargin: {
                        vertical: 10,
                    },
                },
				dataLabels: {
					enabled: false,
					style: {
						colors: this.chartColors,
					},
				},
				colors: this.chartColors,
				xaxis: {
                    categories: this.categories,
                    overwriteCategories: this.overwriteCategories,
				},
				yaxis: [
					{
						title: {
							text: 'Valores',
						},
						labels: {
							formatter: function (value) {
								return formatCurrency(value);
							},
						},
						axisTicks: {
							show: true,
						},
						axisBorder: {
							show: true,
						},
					},
				],
				tooltip: {
                    shared: true,
					custom: ({ s, seriesIndex, dataPointIndex, w }) => {
						const rangeDate = this.isCompare ? this.overwriteCategories[dataPointIndex] : this.categories[dataPointIndex];

						return `<div class="custom-tooltip" style="width: max-content">
                            <div class="date" style="display: flex; justify-content: center; background: #eceff1; padding: 8px 8px;">
                                ${this.isCompare ? this.getFormatedDate(rangeDate[0], rangeDate[1]) : this.getFormatedDate(rangeDate, null)}
                            </div>
                            <div class="data-tooltip" style="display: grid; gap: 12px; ${
								this.isCompare ? 'grid-template-columns: 1fr 1fr;' : 'grid-template-columns: 1fr;'
							}">
                                <div style="padding: 15px 15px; display: grid; gap: 12px;">
                                    ${this.series
										.filter((nothing, index) => index < 3)
										.map(
											(s, index) => `
                                        <div style="display: flex; flex-direction: row; align-items: center; width: 250px;">
                                            <span class="tooltip-circle" style="background: ${
												this.chartColors[index]
											}; height: 10px; width: 10px; border-radius: 50%; margin-right: 10px;"></span>
                                            <p style="margin-right: 10px; font-size: 15px; margin-bottom: 0px;">
                                                ${s.name}:
                                            </p>
                                            <p style="font-weight: bold; font-size: 14px; margin-bottom: 0px;">
                                                ${formatCurrency(s.data[dataPointIndex])}
                                            </p>
                                        </div>`
										)
										.join('')}
                                </div>
                                ${
									this.isCompare
										? `
                                    <div style="padding: 15px 15px; display: grid; gap: 12px;">
                                        ${this.series
											.filter((nothing, index) => index >= 3)
											.map(
												(s, index) => `
                                            <div style="display: flex; flex-direction: row; align-items: center; width: 250px;">
                                                <span class="tooltip-circle" style="background: ${
													this.chartColors[index + 3]
												}; height: 10px; width: 10px; border-radius: 50%; margin-right: 10px;"></span>
                                                <p style="margin-right: 10px; font-size: 15px; margin-bottom: 0px;">
                                                    ${s.name}:
                                                </p>
                                                <p style="font-weight: bold; font-size: 14px; margin-bottom: 0px;">
                                                    ${formatCurrency(s.data[dataPointIndex])}
                                                </p>
                                            </div>`
											)
											.join('')}
                                    </div>
                                `
										: ''
								}
                            </div>
                        </div>`;
					},
				},
			};
		},

		headers() {
			return {
				profit: [
					{
						value: 'none',
					},
					{
						text: 'Mês/Ano',
						value: 'data',
						sortable: true,
					},
					{
						text: 'Leite',
						value: 'leite',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Venda de gado',
						value: 'venda',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Diversos',
						value: 'diversos',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Total',
						value: 'total',
						sortable: true,
						align: 'center',
					},
				],
				cost: [
					{
						value: 'none',
					},
					{
						text: 'Mês/Ano',
						value: 'data',
						sortable: true,
					},
					{
						text: 'Salários',
						value: 'despesa_trabalhistas',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Compras',
						value: 'compra',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Diversos',
						value: 'diversos',
						sortable: true,
						align: 'center',
					},
					{
						text: 'Total',
						value: 'total',
						sortable: true,
						align: 'center',
					},
				],
			};
		},
	},

	async created() {
		await this.getAllData();
	},

	methods: {
		async getAllData() {
			const startDate = new Date();
			startDate.setDate(startDate.getDate() - 10);
			startDate.setHours(0, 0, 0);

			const endDate = new Date();
			endDate.setHours(23, 59, 0);

			this.loading.report = true;
			this.loading.profit = true;
			this.loading.costs = true;
			await this.generateReport([startDate, endDate]);
			await this.getItems([], 'profit');
			await this.getItems([], 'cost');
		},

		async generateReport(range, compare = []) {
			try {
				this.showDialog = false;
				this.loading.report = true;
				this.isCompare = !!compare.length;
				const { data } = await financeController.generateReport(range, compare);

				if (compare.length) {
					this.overwriteCategories = this.getPairedDates(range, compare);
				} else {
					this.overwriteCategories = null;
					this.categories = this.getDates(range[0], range[1]);
				}


				this.setTotals(data.totals.range, data.totals.compare);
				this.setSeries(data.data.range, data.data.compare);
			} catch (e) {
				this.$alert({
					message: 'Erro ao gerar o relatório de finanças. Tente novamente mais tarde',
					...this.defaultAlert,
				});
			} finally {
				this.loading.report = false;
			}
		},

		getDates(startDate, endDate) {
			const template = { year: "numeric", month: "2-digit", day: "2-digit" };
			const dates = [];
			const currentDate = new Date(startDate);

			while (currentDate <= endDate) {
				dates.push(formatDate(new Date(currentDate), template));
				currentDate.setDate(currentDate.getDate() + 1);
			}

			return dates;
		},

		getPairedDates(period1, period2) {
			const template = { year: "numeric", month: "2-digit", day: "2-digit" };
			const pairedDates = [];
			const currentDate1 = new Date(period1[0]);
			const currentDate2 = new Date(period2[0]);
			const endDate1 = new Date(period1[1]);
			const endDate2 = new Date(period2[1]);

			while (currentDate1 <= endDate1 || currentDate2 <= endDate2) {
				let date1 = currentDate1 <= endDate1 ? formatDate(new Date(currentDate1), template) : null;
				let date2 = currentDate2 <= endDate2 ? formatDate(new Date(currentDate2), template) : null;

				if (!date2 && date1) {
					date2 = date1;
					date1 = null;
				}

				pairedDates.push([date1, date2]);

				currentDate1.setDate(currentDate1.getDate() + 1);
				currentDate2.setDate(currentDate2.getDate() + 1);
			}

			return pairedDates;
		},

		async getItems(period = [], type) {
			try {
				this.loading[type] = true;
				let response;

				if (type == 'profit') {
					const { data } = await profitController.listProfits(period);
					response = data;
				} else {
					const { data } = await costController.listCosts(period);
					response = data;
				}

				this.data[type] = response;
			} catch (e) {
				this.$alert({
					message: `Erro ao carregar ${
						type == 'profit' ? 'os lucros' : 'as despesas'
					}. Tente novamente mais tarde`,
					...this.defaultAlert,
				});
			} finally {
				this.loading[type] = false;
			}
		},

		async deleteItem(item, childIndex, id, type) {
			try {
				this.loading[type] = true;
				if (type == 'profit') {
					await profitController.deleteProfit(id);
				} else {
					await costController.deleteCost(id);
				}

				const index = this.data[type].findIndex((i) => JSON.stringify(i) == JSON.stringify(item));
				if (this.data[type][index] && this.data[type][index].childs[childIndex]) {
					const child = this.data[type][index].childs[childIndex];
					this.data[type][index].total -= child.valor;
					this.data[type][index][child.tipo] -= child.valor;
					this.data[type][index].childs.splice(childIndex, 1);
				}

				this.$alert({
					type: 'success',
					message: 'Item deletado com sucesso',
					...this.defaultAlert,
				});
			} catch (e) {
				this.$alert({
					message: 'Erro ao deletar item. Tente novamente mais tarde',
					...this.defaultAlert,
				});
			} finally {
				this.loading[type] = false;
			}
		},

		setTotals(range, compare) {
			Object.keys(range).forEach((key) => {
				this.totals[key].total = range[key];
			});

			if (this.isCompare) {
				Object.keys(compare).forEach((key) => {
					this.totals[key].percentage = this.calculatePercentage(compare[key], this.totals[key].total);
				});
			}
		},

		setSeries(range, compare) {
			this.series = [];
			const parsedRange = [];
			const parsedCompare = [];

			if (this.isCompare) {
				this.overwriteCategories.forEach((date) => {
					const item = this.findItemByDate(range, date[0] || date[1]);
					const compareItem = this.findItemByDate(compare, date[1]);
					parsedRange.push(item);
					parsedCompare.push(compareItem);
				});
			} else {
				this.categories.forEach((date) => {
					const item = this.findItemByDate(range, date);
					parsedRange.push(item || {});
				});
			}

			this.series.push(
				{
					name: 'Receita',
					type: 'line',
					data: parsedRange.map((value) => value.receita || 0),
				},
				{
					name: 'Despesas',
					type: 'line',
					data: parsedRange.map((value) => value.despesas || 0),
				},
				{
					name: 'ROI',
					type: 'line',
					data: parsedRange.map((value) => value.roi || 0),
				}
			);

			if (this.isCompare) {
				this.series.push(
					{
						name: 'Receita a comparar',
						type: 'bar',
						data: parsedCompare.map((value) => value.receita || 0),
					},
					{
						name: 'Despesas a comparar',
						type: 'bar',
						data: parsedCompare.map((value) => value.despesas || 0),
					},
					{
						name: 'ROI a comparar',
						type: 'bar',
						data: parsedCompare.map((value) => value.roi || 0),
					}
				);
			}
		},

		findItemByDate(array, date) {
			const template = { year: "numeric", month: "2-digit", day: "2-digit" };
			return array.find((value) => formatDate(new Date(value.data), template) == date) || {};
		},

		calculatePercentage(newValue, oldValue) {
			const parsedNew = Number(newValue);
			const parsedOld = Number(oldValue);
			if (!parsedOld) return 0;
			return ((parsedNew - parsedOld) / parsedOld) * 100;
		},

		getFormatedDate(range, compare =  null) {
			if (range && compare) {
				return `${range} - ${compare}`;
			}
			else if (!range) {
				return compare;
			} else {
				return range;
			}
		}
	},
};
</script>

<template>
	<div class="flex flex-col gap-6">
		<h1 class="title">Finanças</h1>
		<Button class="w-fit self-end" @click="showDialog = true" :disabled="loading.report">Gerar Relatório</Button>
		<FinanceDialog v-model="showDialog" @generate-report="generateReport" />
		<Totals :totals="totals" :loading="loading.report" :is-compare="isCompare" />
		<Card v-if="!loading.report">
			<apexchart width="100%" height="300px" :options="chartOptions" :series="series" />
		</Card>
	</div>
	<GenericTable
		title="Receita"
		type="profit"
		:headers="headers.profit"
		:items="data.profit"
		:loading="loading.profit"
		add-route="/financas/receita"
		@filter-data="getItems"
		@delete-item="deleteItem"
	/>
	<GenericTable
		title="Despesas"
		type="cost"
		:headers="headers.cost"
		:items="data.cost"
		:loading="loading.cost"
		add-route="/financas/despesa"
		@filter-data="getItems"
		@delete-item="deleteItem"
	/>
</template>
