<script setup lang="ts">
import { Page as BasePage } from "vui/@"
import { useAuth } from "heimdall"
import { computed, onMounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import { PageLine, Logo, PageHeaderTabs, LoginStatus, PageFooterInfo } from "./"

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

onMounted(() => { 
	if (isLocked.value) {
		router.push(`/login?from=${route.path}`)
	} 
})
</script>

<template>
	<BasePage class="w-full max-w-[1600px] p-8 mx-auto" v-if="!isLocked">
		<template #header>
			<div class="flex gap-2">
				<h1 class="grow-0 shrink-0 pl-1 w-80">
					<Logo/>
				</h1>
				<nav class="w-full pr-1 relative">
					<PageHeaderTabs class="absolute bottom-0 left-0"/>
					<LoginStatus class="absolute right-1 bottom-0"/>
				</nav>
			</div>
			<PageLine/>
		</template>

		<template #default>
			<section class="min-h-screen -mt-72 pt-72 pb-4" :class="{ centered }">
				<slot/>
			</section>
		</template>

		<template #footer>
			<PageLine/>
			<PageFooterInfo/>
		</template>
	</BasePage>
</template>

<style lang="postcss" scoped>
.centered {
	@apply grid items-center;
}
</style>