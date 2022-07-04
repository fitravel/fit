<script setup lang="ts">
import { DataTable, ThumbUpIcon, TravelLicenceNumber, NationalRegistryNumber, Email, PhoneNumber } from "vui/@"
import { useUsers } from "heimdall"
import { localize } from "geri"

const users = useUsers()

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
</script>

<template>
	<DataTable :cols="columns" :rows="users.unverified" v-if="users.unverified.length">
		<template #cell:created="{ value }">
			{{ localize(value, "do MMM yyyy — HH:mm") }}
		</template>

		<template #cell:id="{ value }">
			<a href="#" @click.prevent="users.verify(value, true)">
				<ThumbUpIcon class="w-6"></ThumbUpIcon>
			</a>
		</template>

		<template #cell:registry="{ value }">
			<NationalRegistryNumber :no="value"></NationalRegistryNumber>
		</template>

		<template #cell:licence="{ value }">
			<TravelLicenceNumber :no="value"></TravelLicenceNumber>
		</template>

		<template #cell:phone="{ value }">
			<PhoneNumber :no="value"></PhoneNumber>
		</template>

		<template #cell:email="{ value }">
			<Email :address="value"></Email>
		</template>
	</DataTable>
	<div v-else class="border border-green-400 bg-green-200 p-4 text-center text-green-900 opacity-50">
		Það eru engir óstaðfestir aðgangar
	</div>
</template>