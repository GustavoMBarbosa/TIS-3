<script>
import { ref } from 'vue';
import Card from './Card.vue';
import Notification from './Notification.vue';
import Button from './Button.vue';
import Icon from './Icon.vue';
import Spinner from './Spinner.vue';
import NotificationController from '../controller/notification';
import { formatDate } from '../util';

export default {
	name: 'Topbar',
	components: { Card, Notification, Button, Icon, Spinner },
	inject: ['Auth'],
	setup() {
		return {
			formatDate,
			notificationActive: ref(false),
			perfilDropdownActive: ref(false),
			notifications: ref([]),
			notification: ref(),
			notificationIcon: ref(),
			perfilDropdown: ref(),
			perfilIcon: ref(),
			userData: ref(),
			loading: ref({}),
			defaultAlert: ref({
				top: true,
				right: true,
				timeout: 3500,
			}),
		};
	},

	beforeMount() {
		const user = window.sessionStorage.getItem('user');
		this.userData = JSON.parse(user == 'undefined' ? '{}' : user);
		document.addEventListener('click', (event) => {
			this.closeDropdown(event, this.notification?.$el, this.notificationIcon?.$el, 'notificationActive');
			this.closeDropdown(event, this.perfilDropdown?.$el, this.perfilIcon?.$el, 'perfilDropdownActive');
		});
	},

	beforeUnmount() {
		document.removeEventListener('click', (event) => {
			this.closeDropdown(event, this.notification?.$el, this.notificationIcon, 'notificationActive');
			this.closeDropdown(event, this.perfilDropdown?.$el, this.perfilIcon, 'perfilDropdownActive');
		});
	},

	async created() {
		await this.setNotifications();
	},

	methods: {
		async setNotifications() {
			try {
				const notificationArray = await NotificationController.getAll();
				this.notifications = notificationArray || [];
			} catch (error) {}
		},

		async activate(activateNotication, activateUser) {
			this.notificationActive = activateNotication;
			this.perfilDropdownActive = activateUser;
		},

		closeDropdown(event, dropdown, icon, key) {
			if (!dropdown || !icon) return;
			if (
				!dropdown.contains(event.target) &&
				!icon.contains(event.target) &&
				!event.target.closest('.delete-icon')
			)
				this[key] = false;
		},

		logout() {
			this.Auth.logout();
			this.$route.push({ path: '/' });
		},
		async deleteNotification(item, index) {
			this.loading[index] = true;
			try {
				await NotificationController.deleteNotification(item.id);
				this.notifications.splice(index, 1);
				this.$alert({
					message: 'Notificação deletada com sucesso',
					type: 'success',
					...this.defaultAlert,
				});
			} catch (error) {
				this.$alert({
					message: 'Erro ao deletar notificação. Tente novamente mais tarde',
					...this.defaultAlert,
				});
			} finally {
				this.loading[index] = false;
			}
		},
	},
};
</script>

<template>
	<div class="top-holder">
		<div class="relative flex gap-2">
			<div class="relative">
				<span v-if="notifications.length" class="have-item" />
				<Icon
					class="top-icon"
					name="circle_notifications"
					ref="notificationIcon"
					:class="{ active: notificationActive }"
					@click="activate(!notificationActive, false)"
				/>
			</div>
			<div>
				<Icon
					class="top-icon"
					name="account_circle"
					ref="perfilIcon"
					:class="{ active: perfilDropdownActive }"
					@click="activate(false, !perfilDropdownActive)"
				/>
			</div>
			<div class="absolute right-0 top-14">
				<Notification v-if="notificationActive" ref="notification" :items="notifications">
					<template #empty-state>
						<div class="empty-state">
							<Icon name="notifications" />
							Sem notificações
						</div>
					</template>
					<template #item="{ item, index }">
						<div class="flex justify-between items-start gap-2 px-2 py-1">
							<div class="flex flex-col gap-2">
								<h5 class="text-xl font-bold">{{ item.titulo }}</h5>
								<p class="description">
									{{ item.descricao }}. Data prevista para {{ formatDate(new Date(item.vencimento)) }}
								</p>
							</div>
							<Spinner v-if="loading[index]" />
							<Icon v-else class="delete-icon" name="delete" @click="deleteNotification(item, index)" />
						</div>
					</template>
				</Notification>
				<Card
					v-else-if="perfilDropdownActive"
					ref="perfilDropdown"
					class="flex flex-col items-center gap-4 w-fit"
				>
					<h3 class="user-name">{{ userData.name }}</h3>
					<div class="flex flex-col gap-2 w-full">
						<router-link to="/perfil" @click="activate(false, false)">
							<Button class="whitespace-nowrap w-full">Editar Perfil</Button>
						</router-link>
						<Button only-border class="w-full" @click="logout()">Logout</Button>
					</div>
				</Card>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
@import '../style/var.scss';

.delete-icon.material-symbols-rounded {
	font-size: 25px;

	&:hover {
		color: $red-strong;
	}
}

.material-symbols-rounded {
	font-size: 50px;
	color: $gray-500;
	cursor: pointer;

	&:hover {
		color: $green-dark;
	}
}

.material-symbols-rounded.active {
	color: $green-dark;
}

.empty-state {
	@apply flex flex-col gap-2 items-center;
	user-select: none;
	color: $gray-400;

	.material-symbols-rounded {
		font-size: 60px;
		color: $gray-400;
		cursor: auto;
	}
}

.user-name {
	@apply font-bold text-2xl;
	color: $green-dark;
}

.top-holder {
	@apply fixed md:right-0 px-4 py-2 md:px-6 md:py-4 md:w-fit w-full h-fit flex justify-end;
	z-index: 80;
}

.top-icon {
	background: $gray-200;
	border-radius: 50%;
}

.have-item {
	z-index: 10;
	position: absolute;
	right: 0;
	height: 20px;
	width: 20px;
	background: $orange-strong;
	border-radius: 50%;
}

h5 {
	color: $green-dark;
}

.description {
	@apply text-sm;
	color: $gray-500;
}

@media screen and (max-width: 768px) {
	.top-holder {
		background: $gray-200;
	}
}
</style>
