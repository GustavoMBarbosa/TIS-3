<template>
	<div class="container">
		<Card>
			<h2>Porcentagem lactante</h2>
			{{ getReport().lactatingPercentage.porcentagem_lactantes }}
			<!-- <p>{{ Math.toFixed(getReport.lactatingPercentage.porcentagem_lactantes, 2) }}</p> -->
		</Card>
		<Card>
			<h2>Porcentagem lactante</h2>
			<!-- <p>{{ getReport.confirmedGestation.count }}</p> -->
		</Card>
	</div>
</template>
<script>
import Card from "@/components/Card.vue";
import { useFetchs } from "@/view/gado/composables/useFetchs";

export default {
	components: {
		Card,
	},
	setup() {
		const { getReport } = useFetchs();
		return {
			getReport,
		};
	},
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	justify-content: space-around;
	gap: 20px;
	height: 20%;
}
</style>
