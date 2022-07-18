<script setup lang="ts">
import { DataTable, PencilIcon, Anchor, LightningBoltIcon, TerminalIcon, TagIcon, TravelLicenceNumber, 
	NationalRegistryNumber, Email, PhoneNumber } from "vui/@"
import { LightningBoltIcon as OutlinedLightningBoltIcon } from "@heroicons/vue/outline"
import { useUser, useUsers } from "heimdall"
import { computed } from "vue"

const users = useUsers()
const user  = useUser()

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
const table = computed(() => ({
	cols: columns,
	rows: users.verified,
	noResults: 'Það eru engir staðfestir aðgangar',
	loading: users.isLoading
}))
</script>

<template>
	<DataTable id="verified-user-table" v-bind="table">
		<template #cell:isActive="{ value, row }">
			<a href="#" @click.prevent="user.toggle(row.id).then(() => users.get())">
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
</template>


<style lang="postcss" scoped>
#verified-user-table {
	&:deep(.no-results) {
		@apply border border-red-400 bg-red-200 p-4 text-center text-red-900 opacity-50;
	}
}
</style>