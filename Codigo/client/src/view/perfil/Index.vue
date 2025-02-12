<script>
import userController from '@/controller/user.js';
import authController from '@/controller/auth.js';
import { ref } from 'vue';
import Card from '@/components/Card.vue';
import Dialog from '@/components/Dialog.vue';
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';
import Icon from '@/components/Icon.vue';
import { useIconLoader } from '@/store/iconLoader.js';
import Loader from '@/components/Loader.vue';
import axios from 'axios';

export default {
	name: 'Perfil',
	components: { Card, Dialog, Button, Input, Icon, Loader },
	inject: ['Auth'],
	setup() {
		const { iconsLoaded } = useIconLoader();
		const loading = ref(false);
		return {
			editing: ref(false),
			defaultAlert: ref({
				top: true,
				right: true,
				timeout: 3500,
			}),
			userData: ref({}),
			userDataDatabase: ref({}),
			loading,
			iconsLoaded,
		};
	},

	computed: {
		size() {
			return window.innerWidth > 352 ? 'medium' : 'small';
		},
	},

	async beforeMount() {
		this.userData = JSON.parse(window.sessionStorage.getItem('user'));
		const { data } = await axios.get(`http://localhost:3000/user/${this.userData.email}`);
		this.userDataDatabase = data;
		sessionStorage.setItem('userDatabase', JSON.stringify(data));
	},

	methods: {
		async handleDelete() {
			const result = await this.$confirm({
				title: 'Tem certeza que deseja deletar sua conta?',
				description: 'Ao apagar sua conta, todos os dados cadastrados serão perdidos para sempre.',
			});
			if (!result) return;
			try {
				await userController.deleteUser();
			} catch (e) {
				this.$alert({
					message: 'Error ao deletar o usuário. Tente novamente mais tarde.',
					...this.defaultAlert,
				});
			}
		},

		async salveUser() {
			if (!this.isValid()) {
				this.$alert({
					message: 'Preencha todos os campos para alterar seu usuário',
					...this.defaultAlert,
				});
				return;
			} else if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(this.userData.email)) {
				this.$alert({
					message: 'Digite um e-mail válido',
					...this.defaultAlert,
				});
				return;
			}

			this.loading = true;
			try {
				const data = JSON.parse(JSON.stringify(this.userDataDatabase));
				delete data.id;
				await userController.updateUser(this.userDataDatabase.id, data);
				window.sessionStorage.setItem('userDatabase', JSON.stringify(this.userDataDatabase));

				this.$alert({
					message: 'Usuário alterado com sucesso',
					type: 'success',
					...this.defaultAlert,
				});
			} catch (e) {
				this.$alert({
					message: 'Error ao alterar o usuário. Tente novamente mais tarde',
					...this.defaultAlert,
				});
			} finally {
				this.loading = false;
				this.editing = false;
			}
		},

		isValid() {
			return this.userDataDatabase.nome;
		},
	},
};
</script>

<template>
	<div class="flex flex-col gap-6 w-full">
		<h1 class="title">Perfil</h1>
		<Card class="w-full flex flex-col gap-4">
			<div class="actions">
				<div class="circle-icon" :class="{ active: editing }" @click="editing = !editing">
					<Icon name="edit" />
				</div>
				<div class="circle-icon" @click="handleDelete">
					<Icon name="delete" />
				</div>
			</div>
			<div class="photo-name">
				<Icon name="account_circle" />
				<input
					v-model="userDataDatabase.nome"
					class="name-input"
					:disabled="!editing"
					:class="{ active: editing }"
				/>
			</div>
			<div class="flex flex-col gap-4">
				<Input v-model="userDataDatabase.descricao" label="Descrição" :disabled="!editing" text-area />
				<Input
					v-model="userDataDatabase.email"
					error-message="E-mail inválido"
					label="E-mail"
					disabled
					type="email"
				/>
				<!-- <Button class="w-fit" @click="changingPass = true">Alterar Senha</Button> -->
			</div>
		</Card>
		<div class="flex w-full justify-end gap-2">
			<Button v-if="editing" :disabled="loading" @click="editing = false" only-border>Cancelar</Button>
			<Button v-if="editing" :loading="loading" @click="salveUser">Salvar</Button>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import '../../style/var.scss';

.actions {
	display: flex;
	justify-content: flex-end;
	gap: 0.5em;
}

.circle-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	background: $gray-500;
	border-radius: 50%;
	color: white;
	cursor: pointer;

	&:hover {
		background: $green-dark;
	}
}

.circle-icon.active {
	background: $green-dark;

	&:hover {
		background: $green-800;
	}
}

.photo-name {
	@apply flex gap-2 md:flex-row flex-col items-center;

	.material-symbols-rounded {
		font-size: 9em;
		color: $green-dark;
	}

	.name-input {
		font-size: 2em;
		font-weight: 600;
		color: $green-dark;
		padding: 0.2em 0.5em;
		border-radius: 16px;
		border: 0.1em transparent solid;
		max-width: 100%;
		background: transparent;

		&:focus {
			outline: none;
		}
	}

	.name-input.active {
		border-color: $gray-300;
	}
}

h1 {
	color: $green-dark;
}

@media screen and (max-width: 768px) {
	.photo-name .name-input {
		font-size: 1.5em;
		text-align: center;
	}
}
</style>
