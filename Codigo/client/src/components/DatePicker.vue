<script>
import { ref, reactive } from "vue";
import SelectContainer from "./SelectContainer.vue";
import Icon from "./Icon.vue";
import { upperCaseFirstLetter, formatDate } from "../util/index.js";

export default {
	name: "DatePicker",
	components: { SelectContainer, Icon },
	props: {
		modelValue: Array | Date,
		maxDate: Date,
		minDate: Date,
		isCompare: {
			type: Boolean,
			default: false,
		},
		expanded: {
			type: Boolean,
			default: false,
		},
		label: String,
		disabled: Boolean,
	},
	emits: ["update:modelValue", "update:expanded"],
	setup() {
		return {
			isExpanded: ref(),
			month: ref([]),
			weekDays: ref(["D", "S", "T", "Q", "Q", "S", "S"]),
			model: ref(),
			title: ref(),
			calendarDate: reactive(new Date()),
			hoverDate: ref(),
			title: ref(""),
			isBack: ref(false),
			show: ref(true),
			showingMonths: ref(false),
			showingYears: ref(false),
		};
	},

	created() {
		if (this.modelValue) {
			this.model = this.modelValue;
		} else {
			if (this.isCompare) {
				this.model = [];
			} else {
				this.model = null;
			}
		}

		this.isExpanded = this.expanded;
		this.getTitle();
		this.getArrayMonthDay();
	},

	watch: {
		modelValue() {
			this.model = this.modelValue;
		},
		expanded() {
			this.isExpanded = this.expanded;
		},
		isCompare() {
			this.resetDate();
		},
	},

	computed: {
		months() {
			const date = new Date("2021-01-03T23:15:30");
			const months = [];
			for (let i = 0; i < 12; i++) {
				const formattedDay = date.toLocaleDateString("pt-BR", { month: "short" });
				months.push(formattedDay);
				date.setMonth(date.getMonth() + 1);
			}
			return months;
		},

		years() {
			const years = [];
			for (let i = this.calendarDate.getFullYear(); i >= this.calendarDate.getFullYear() - 61; i--) {
				years.push(i);
			}
			return years;
		},

		status() {
			const template = { year: "numeric", month: "2-digit", day: "2-digit" };
			if (this.isCompare && this.model[0] instanceof Date) {
				return (
					formatDate(this.model[0], template) +
					(this.model[1] instanceof Date ? `-${formatDate(this.model[1], template)}` : "")
				);
			} else if (this.model instanceof Date) {
				return formatDate(this.model, template);
			}
			return "";
		},
	},

	methods: {
		changeExpanded(value) {
			this.isExpanded = value;
			this.$emit("update:expanded", this.isExpanded);
		},

		changeModel(value) {
			this.model = value;
			this.$emit("update:modelValue", this.model);
		},

		getArrayMonthDay() {
			const date = this.calendarDate;
			const year = date.getFullYear();
			const month = date.getMonth();
			const firstDay = new Date(year, month, 1).getDay();
			const maxDays = new Date(year, month + 1, 0).getDate();
			let day = 1;
			this.month = [];
			for (let i = 0; i < 6; i++) {
				const week = [];
				for (let j = 0; j < 7; j++) {
					if ((i === 0 && j < firstDay) || day > maxDays) {
						week.push("");
					} else {
						const newDate = new Date(year, month, day);
						week.push(newDate);
						day++;
					}
				}
				this.month.push(week);
			}
		},

		selectDate(date) {
			if (this.isCompare) {
				if (this.model.length == 2) this.model = [];

				if (this.model.length == 1) {
					const date1 = this.model[0];

					if (date1.toISOString().substring(0, 10) > date.toISOString().substring(0, 10)) {
						this.model[0] = date;
						this.model[1] = date1;
					} else {
						this.model.push(date);
					}
				} else {
					this.model[0] = date;
				}
			} else {
				this.model = date;
			}
			this.$emit("update:modelValue", this.model);
		},

		isDateSelected(date) {
			if (this.isCompare) {
				if (this.model.length === 2) {
					return (
						this.model[0].toISOString().substring(0, 10) <= date &&
						this.model[1].toISOString().substring(0, 10) >= date
					);
				} else if (this.model.length === 1) {
					return this.model[0].toISOString().substring(0, 10) == date;
				}
			} else if (this.model instanceof Date) {
				return this.model.toISOString().substring(0, 10) == date;
			}
			return false;
		},

		isBetween(date) {
			if (!this.isCompare || this.model.length !== 1) return false;
			return (
				(this.model[0].toISOString().substring(0, 10) < date &&
					this.hoverDate >= date &&
					this.hoverDate > this.model[0].toISOString().substring(0, 10)) ||
				(this.model[0].toISOString().substring(0, 10) > date &&
					this.hoverDate <= date &&
					this.hoverDate < this.model[0].toISOString().substring(0, 10))
			);
		},

		changeViewMonth(day) {
			this.isBack = day === -1;
			this.show = false;
			this.calendarDate.setMonth(this.calendarDate.getMonth() + day);
			this.getTitle();
			this.getArrayMonthDay();
			setTimeout(() => {
				this.show = true;
			}, 100);
		},

		getTitle() {
			let template = { month: "long", year: "numeric" };
			if (this.showingMonths || this.showingYears) {
				template = { year: "numeric" };
			}
			const title = formatDate(this.calendarDate, template);
			this.title = upperCaseFirstLetter(title);
		},

		showMonthsOrYears() {
			if (this.showingMonths && !this.showingYears) {
				this.showingYears = true;
				return;
			}
			this.showingMonths = !this.showingMonths;
			this.showingYears = false;
			this.getTitle();
		},

		changeMonth(month) {
			this.showingMonths = false;
			this.calendarDate.setMonth(month);
			this.getTitle();
			this.getArrayMonthDay();
		},

		changeYear(year) {
			this.showingMonths = false;
			this.showingYears = false;
			this.calendarDate.setFullYear(year);
			this.getTitle();
			this.getArrayMonthDay();
		},

		resetDate() {
			if (this.isCompare) {
				this.changeModel([]);
			} else {
				this.changeModel(null);
			}
		},
		isDisabled(day) {
			let disabled = false;

			if (this.minDate) {
				disabled = this.minDate.toISOString().substring(0, 10) > day;
			}

			if (this.maxDate) {
				disabled = this.maxDate.toISOString().substring(0, 10) < day;
			}

			return disabled;
		},
	},
};
</script>

<template>
	<SelectContainer
		v-model="isExpanded"
		@update:model-value="changeExpanded"
		:label="label"
		:disabled="disabled"
		icon="calendar_month"
		class="date-holder"
	>
		<template #status>
			<p v-if="status" class="status-text">{{ status }}</p>
			<slot v-else />
		</template>
		<template #item>
			<div class="w-fit px-1 relative overflow-hidden">
				<div class="flex items-center justify-between gap-2 py-4">
					<div class="chevron" @click="changeViewMonth(-1)">
						<Icon name="chevron_left" />
					</div>
					<Transition :name="!isBack ? 'slide-fade' : 'slide-fade-out'">
						<h1 class="text-lg font-bold cursor-pointer date-title" v-if="show" @click="showMonthsOrYears">
							{{ title }}
						</h1>
					</Transition>
					<div class="chevron" @click="changeViewMonth(1)">
						<Icon name="chevron_right" />
					</div>
				</div>
				<div>
					<Transition :name="!isBack ? 'slide-fade' : 'slide-fade-out'">
						<table v-if="show">
							<tr class="date-space table-header">
								<th v-for="(weekDay, index) in weekDays" :key="index">{{ weekDay }}</th>
							</tr>
							<tr v-for="(week, index) in month" :key="index" class="date-space" :class="week">
								<td v-for="(day, index) in week" :key="index">
									<div
										v-if="day"
										class="day"
										:class="{
											selected: isDateSelected(day.toISOString().substring(0, 10)),
											hover: hoverDate && isBetween(day.toISOString().substring(0, 10)),
											disabled: isDisabled(day.toISOString().substring(0, 10)),
										}"
										@mouseenter="hoverDate = day.toISOString().substring(0, 10)"
										@mouseleave="hoverDate = null"
										@click="selectDate(day)"
									>
										{{ day.getDate() }}
									</div>
								</td>
							</tr>
						</table>
					</Transition>
				</div>
				<Transition name="appear">
					<div v-if="showingMonths && !showingYears" class="appear-card">
						<div
							v-for="(month, index) in months"
							:key="index"
							class="month-card"
							:class="{ active: calendarDate.getMonth() === index }"
							@click="changeMonth(index)"
						>
							{{ month }}
						</div>
					</div>
				</Transition>
				<Transition name="appear">
					<div v-if="showingYears" class="appear-card year">
						<div
							v-for="(year, index) in years"
							:key="index"
							class="year-card"
							:class="{ active: calendarDate.getFullYear() === year }"
							@click="changeYear(year)"
						>
							{{ year }}
						</div>
					</div>
				</Transition>
			</div>
			<div class="actions">
				<a @click="resetDate">Limpar</a>
			</div>
		</template>
	</SelectContainer>
</template>

<style scoped lang="scss">
@import "../style/var.scss";

.date-holder {
	width: 320px;
}

.date-space {
	@apply [&>*]:p-[.4em];
}

.table-header {
	color: $gray-500;
}

.status-text {
	font-size: 16px;
	color: $gray-500;
}

.chevron {
	display: flex;
	align-items: center;
	border-radius: 50%;
	padding: 0.1em;
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

.day {
	display: flex;
	justify-content: center;
	align-items: center;
	color: $gray-500;
	border-radius: 50%;
	padding: 0.2em 0.35em;
	font-size: 16px;
	cursor: pointer;

	&:hover {
		color: white;
		background: $green-100;
	}
}

.day.selected {
	color: white;
	background: $green-dark;

	&:hover {
		background: $green-dark;
	}
}

.day.hover {
	color: white;
	background: $green-100;
}

.day.disabled {
	@apply pointer-events-none;
	background: $gray-300;
}

.date-title {
	color: $gray-500;
}

.appear-card {
	@apply w-full absolute top-[15%] left-0 gap-2 bg-white;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	padding: 1em 0.5em;
	height: 90%;
}

.appear-card.year {
	@apply divide-y-[.1em] divide-gray-100;
	display: flex;
	flex-direction: column;
	overflow-y: auto;
	padding: 0;
	gap: 0;
}

.month-card {
	@apply flex justify-center items-center cursor-pointer;
	max-height: 50px;
	background: $green-100;
	padding: 1em;
	color: white;
	border-radius: 4px;
	font-size: 16px;

	&:hover {
		background: $green-dark;
	}
}
.month-card.active {
	background: $green-dark;
}

.year-card {
	@apply w-full flex justify-center items-center cursor-pointer;
	color: $gray-500;
	padding: 0.1em 0.5em;
	font-size: 16px;

	&:hover {
		background: $green-100;
		color: $green-dark;
	}
}

.year-card.active {
	background: $green-100;
	color: $green-dark;
}

.actions {
	@apply flex justify-end;
	border-top: 0.2em $gray-200 solid;
	cursor: pointer;
	padding: 1em;

	a,
	a:visited {
		color: $green-dark;

		&:hover {
			text-decoration: underline;
		}
	}
}

.slide-fade-enter-active {
	@apply transition-all duration-300 ease-out;
}

.slide-fade-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	@apply opacity-0;
	transform: translateX(20px);
}

.slide-fade-out-enter-active {
	@apply transition-all duration-300 ease-out;
}

.slide-fade-out-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-out-enter-from,
.slide-fade-out-leave-to {
	@apply opacity-0;
	transform: translateX(-20px);
}

.appear-enter-active {
	@apply transition-all duration-500 ease-out;
}

.appear-leave-active {
	@apply transition-all duration-500 ease-out;
}

.appear-enter-from,
.appear-leave-to {
	transform: translate(-500px, 0);
}
</style>
