<script setup lang="ts">
import { Page as BasePage, LockClosedIcon, PencilIcon, Anchor, UsersIcon, LogoutIcon, TableIcon } from "vui/@"
import { useAuth } from "heimdall"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import RegistryNumber from "vui/@/RegistryNumber.vue";

const props = defineProps<{
	secure?: boolean
	admin?: boolean
	centered?: boolean
}>()

const auth   = useAuth()
const router = useRouter()
const route  = useRoute()

const isLocked = computed(() => {
	const isSecure = props.secure ?? false
	const isAdmin  = props.admin ?? false

	if (!isSecure && !isAdmin) return false
	if (isAdmin && !auth.isAdmin) return true
	if (isSecure && !auth.isLoggedIn) return true

	return false
})
const login  = () => router.push('/login?from=${route.path}')
const logout = () => auth.logout(() => router.push('/login?logout=true'))
onMounted(() => { if (isLocked.value) router.push(`/login?from=${route.path}`) })

</script>

<template>
	<BasePage class="w-full max-w-[1600px] mx-auto" v-if="!isLocked">
		<template #header>
			<div class="flex p-8 gap-2">
				<Anchor to="/" class="border-b-[3px] pb-4 grow-0 shrink-0 pl-1 border-[#014387] w-80">
					<img src="/fi-logo.jpg" class="h-24">
				</Anchor>
				
				<nav class="w-full border-b-[3px] pb-4 pr-1 border-[#d61a21] relative">
					<div class="tabs">
						<Anchor to="/dash" :class="{ active: $route.path === '/dash' }" v-if="auth.isLoggedIn">
							<TableIcon class="w-8"></TableIcon> Markaðstorg
						</Anchor>
						<Anchor to="/users" :class="{ active: $route.path === '/users' }" v-if="auth.isAdmin">
							<UsersIcon class="w-8"></UsersIcon> Aðgangar
						</Anchor>
					</div>

					<div class="absolute right-1 bottom-4">
						<div v-if="!auth.isLoggedIn" class="overflow-hidden shadow border-b border-gray-300 rounded-3xl">
							<button @click="login" class="flex shadow-inner hover:bg-gray-300 pl-5 bg-gray-200 pr-6 py-2 text-gray-500">
								<LockClosedIcon class="h-6 text-gray-500"></LockClosedIcon>
								<span class="pl-1 pt-0.5">
									Markaðstorg
								</span>
							</button>
						</div>

						<div v-else class="text-right">
							<p>
								Velkomin/n, <strong>{{ auth.user.name }}</strong>
							</p>
							<p class="text-sm">
								Leyfisnr. {{ auth.user.licence }} • kt. <RegistryNumber :no="auth.user.registry"></RegistryNumber>
							</p>
							<div class="inline-flex">
								<Anchor :to="`/user/${auth.user.id}`" class="block text-sm">
									<PencilIcon class="w-3 inline-block mr-1 text-gray-500"></PencilIcon>
									<span class="inline-block">Breyta aðgangi</span>
								</Anchor>
								<a href="#" class="block text-sm" @click.prevent="logout">
									<LogoutIcon class="w-3 inline-block ml-2 mr-1 text-gray-500"></LogoutIcon>
									<span class="inline-block">Útskrá</span>
								</a>
							</div>
						</div>
					</div>

				</nav>
			</div>
		</template>

		<template #default>
			<section class="min-h-screen -mt-72 p-8 pt-72" :class="{ centered }">
				<slot></slot>
			</section>
		</template>

		<template #footer>
			<div class="flex p-8 pb-0 gap-2">
				<div class="border-t-[3px] pt-4 grow-0 shrink-0 pl-1 border-[#014387] w-80"></div>
				<div class="w-full border-t-[3px] pb-3 pl-12 pr-1 border-[#d61a21]"></div>
			</div>
			<div id="footer-info">
				<span>Ferðaskrifstofa Íslands ehf.</span>
				<span>Hlíðasmára 19, 201 Kópavogur</span>
				<span>heildsolutengilidur@fitravel.is</span>
				<span>s. +354 585 4000</span>
			</div>
		</template>
	</BasePage>
</template>

<style lang="postcss" scoped>
#page-header {
	.tabs {
		@apply flex gap-8 absolute bottom-4 left-0;

		a {
			@apply flex gap-2 text-lg no-underline font-bold items-center;

			&:not(.active) {
				@apply text-[#004287] opacity-50;
			}
		}
	}
}
.centered {
	@apply grid items-center;
}
#footer-info {
	@apply text-center text-gray-500 px-8 pb-8;

	> span {
		@apply inline-block;

		& + span::before {
			content: '•';
			@apply px-1;
		}
	}
}
</style>