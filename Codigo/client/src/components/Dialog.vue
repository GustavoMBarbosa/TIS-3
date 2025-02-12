<script>
import { ref } from 'vue';

export default {
	name: 'Dialog',
	props: {
		modelValue: Boolean,
		width: {
			type: String,
			default: 'fit-content',
		},
		height: {
			type: String,
			default: 'fit-content',
		},
		noOverflow: {
			type: Boolean,
			default: false,
		},
		overflowHidden: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['update:modelValue'],
	setup() {
		return {
			model: ref(false),
			dialogBg: ref(),
			dialog: ref(),
		};
	},
	watch: {
		modelValue() {
			this.model = this.modelValue;
		},
	},
	beforeMount() {
		document.addEventListener('click', (event) => {
			if (!this.dialogBg || !this.dialog) return;
			if (this.dialogBg.contains(event.target) && !this.dialog.contains(event.target)) {
				this.model = false;
				this.$emit('update:modelValue', this.model);
			}
		});
	},
	beforeUnmount() {
		document.removeEventListener('click', (event) => {
			if (!this.dialogBg || !this.dialog) return;
			if (this.dialogBg.contains(event.target) && !this.dialog.contains(event.target)) {
				this.model = false;
				this.$emit('update:modelValue', this.model);
			}
		});
	},
};
</script>

<template>
	<Transition name="bounce">
		<div ref="dialogBg" class="dialog-bg" v-if="model">
			<div
				ref="dialog"
				class="dialog"
				:class="{ 'overflow-auto': !noOverflow, 'overflow-hidden': overflowHidden }"
				:style="{ width: width, height: height }"
			>
				<slot />
			</div>
		</div>
	</Transition>
</template>

<style scoped lang="scss">
@import '../style/var.scss';

.dialog-bg {
	z-index: 1000;
	position: fixed;
	top: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100vh;
	background: $gray-500-60;
}

.dialog {
	background: white;
	border-radius: 16px;
	padding: 1em;
	margin: 2em;
	max-height: 90vh;
}

.bounce-enter-active {
	animation: bounce-in 0.5s;
}
.bounce-leave-active {
	animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
	0% {
		transform: scale(0);
		opacity: 0;
	}
	100% {
		transform: scale(1);
		opacity: 1;
	}
}
</style>
