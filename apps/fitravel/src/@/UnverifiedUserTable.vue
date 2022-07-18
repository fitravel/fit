<script setup lang="ts">
import { DataTable, ThumbUpIcon, TravelLicenceNumber, NationalRegistryNumber, Email, PhoneNumber } from "vui/@"
import { useUser, useUsers } from "heimdall"
import { localize } from "geri"
import { computed } from "vue";

const users = useUsers()
const user  = useUser()

const columns = [
	{ header: 'Sótt um', key: 'created' },
	{ header: 'Ferðaskrifstofa', key: 'name' },
	{ header: 'Kennitala', key: 'registry', col: 'text-center' },
	{ header: 'Leyfisnúmer', key: 'licence', col: 'text-center' },
	{ header: 'Nafn tengiliðs', key: 'contact', col: 'text-center' },
	{ header: 'Netfang', key: 'email', col: 'text-center' },
	{ header: 'Símanúmer', key: 'phone', col: 'text-center' },
	{ header: 'Samþykkja', key: 'id', col: 'text-center' },
]
const table = computed(() => ({
	cols: columns,
	rows: users.unverified,
	noResults: 'Það eru engir óstaðfestir aðgangar',
	loading: users.isLoading
}))
</script>

<template>
	<DataTable id="unverified-user-table" v-bind="table">
		<template #cell:created="{ value }">
			{{ localize(value, "do MMM yyyy — HH:mm") }}
		</template>

		<template #cell:id="{ value }">
			<a href="#" @click.prevent="user.verify(value).then(() => users.get())">
				<ThumbUpIcon class="w-6"/>
			</a>
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
	</DataTable>
</template>

<style lang="postcss" scoped>
#unverified-user-table {
	&:deep(.no-results) {
		@apply border border-green-400 bg-green-200 p-4 text-center text-green-900 opacity-50;
	}
}
</style>