<script setup lang="ts">
import { DataTable, PencilIcon, Anchor, LightningBoltIcon, TerminalIcon, TagIcon, TravelLicenceNumber, 
	NationalRegistryNumber, Email, PhoneNumber } from "vui/@"
import { LightningBoltIcon as OutlinedLightningBoltIcon } from "@heroicons/vue/outline"
import { useUsers } from "heimdall"

const users = useUsers()

const columns = [
	{ header: 'Ferðaskrifstofa', key: 'name' },
	{ header: 'Kennitala', key: 'registry', col: 'text-center' },
	{ header: 'Leyfisnúmer', key: 'licence', col: 'text-center' },
	{ header: 'Nafn tengiliðs', key: 'contact', col: 'text-center' },
	{ header: 'Netfang', key: 'email', col: 'text-center' },
	{ header: 'Símanúmer', key: 'phone', col: 'text-center' },
	{ header: 'Réttindi', key: 'role', col: 'text-center' },
	{ header: 'Virkur', key: 'isActive', col: 'text-center' },
	{ header: 'Breyta', key: 'id', col: 'text-center' }
]
</script>

<template>
	<DataTable :cols="columns" :rows="users.verified" v-if="users.verified.length">
		<template #cell:isActive="{ value, row }">
			<a href="#" @click.prevent="() => users.toggle(row.id, true)">
				<LightningBoltIcon v-if="value" class="w-6"/>
				<OutlinedLightningBoltIcon v-else class="w-6 text-gray-400"/>
			</a>
		</template>

		<template #cell:id="{ value }">
			<Anchor :to="`/user/${value}`">
				<PencilIcon class="w-6"/>
			</Anchor>
		</template>

		<template #cell:registry="{ value }">
			<NationalRegistryNumber :no="value"/>
		</template>

		<template #cell:licence="{ value }">
			<TravelLicenceNumber :no="value"/>
		</template>

		<template #cell:phone="{ value }">
			<PhoneNumber :no="value"/>
		</template>

		<template #cell:email="{ value }">
			<Email :address="value"/>
		</template>

		<template #cell:role="{ value }">
			<span class="inline-block w-6">
				<TerminalIcon v-if="value === 'admin'"/>
				<TagIcon v-if="value === 'reseller'"/>
			</span>
		</template>
	</DataTable>
	<div v-else class="border border-red-400 bg-red-200 p-4 text-center text-red-900 opacity-50">
		Það eru engir staðfestir aðgangar
	</div>
</template>