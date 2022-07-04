<script setup lang="ts">
import { useAuth } from "heimdall"
import { useRoute, useRouter } from "vue-router"
import { LockClosedIcon, PencilIcon, Anchor, LogoutIcon, 
	NationalRegistryNumber, TravelLicenceNumber } from "vui/@"

const auth   = useAuth()
const router = useRouter()
const route  = useRoute()

const login  = () => router.push(`/login?from=${route.path}`)
const logout = () => auth.logout(() => router.push('/login?logout=true'))
</script>

<template>
	<div>
		<div v-if="!auth.isLoggedIn" class="overflow-hidden shadow border-b border-gray-300 rounded-3xl">
			<button @click="login" class="flex shadow-inner hover:bg-gray-300 pl-5 bg-gray-200 pr-6 py-2 text-gray-500">
				<LockClosedIcon class="h-6 text-gray-500"></LockClosedIcon>
				<span class="pl-1 pt-0.5">
					Innskráning
				</span>
			</button>
		</div>

		<div v-else class="text-right">
			<p>
				Velkomin/n, <strong>{{ auth.user.contact }}</strong>
			</p>
			<p class="text-sm">
				f.h. {{ auth.user.name }}
			</p>
			<p class="text-sm">
				Leyfisnr. <TravelLicenceNumber :no="auth.user.licence"></TravelLicenceNumber> 
				• 
				kt. <NationalRegistryNumber :no="auth.user.registry"></NationalRegistryNumber>
			</p>
			<div class="inline-flex">
				<Anchor :to="`/user/${auth.user.id}`" class="block text-sm">
					<PencilIcon class="w-3 inline-block mr-1 text-gray-500"></PencilIcon>
					<span class="inline-block">Breyta aðgangi</span>
				</Anchor>
				<Anchor to="#" class="block text-sm" @click.prevent="logout">
					<LogoutIcon class="w-3 inline-block ml-2 mr-1 text-gray-500"></LogoutIcon>
					<span class="inline-block">Útskrá</span>
				</Anchor>
			</div>
		</div>
	</div>
</template>