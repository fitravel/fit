<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { DataTable, PencilAltIcon, Anchor } from "vui/@"
</script>

<template>
	<Page secure="admin" class="h-64">
		<DataTable 
			:cols="[
				{ header: 'Nafn', key: 'name' },
				{ header: 'Netfang', key: 'email' },
				{ header: '', key: 'id' },
			]"
			:rows="[
				{ id: 1, name: 'Doddi', email: 'doddi@uu.is' },
				{ id: 2, name: 'Sella', email: 'sesselja@fitravel.is' }
			]"
		>
			<template #cell:id="{ value }">
				<Anchor :to="`/user/${value}`">
					<PencilAltIcon class="w-6"/>
				</Anchor>
			</template>
		</DataTable>
	</Page>
</template>