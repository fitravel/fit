<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { DataTable, PencilAltIcon, Anchor } from "vui/@"
</script>

<template>
	<Page secure admin>
		<DataTable 
			:cols="[
				{ header: 'Nafn', key: 'name' },
				{ header: 'Netfang', key: 'email' },
				{ header: 'Símanúmer', key: 'phone' },
				{ header: 'Kennitala', key: 'registry' },
				{ header: 'Leyfisnúmer', key: 'licence' },
				{ header: 'Réttindi', key: 'role' },
				{ header: '', key: 'id' },
			]"
			:rows="[
				{ id: 1, name: 'Doddi', email: 'doddi@uu.is', phone: '7737323', registry: '211284-2939', licence: '-', role: 'admin' },
				{ id: 2, name: 'Sella', email: 'sesselja@fitravel.is', phone: '5854000', registry: '470103-2990', licence: '-', role: 'admin' },
				{ id: 3, name: 'Úrval Útsýn', email: 'info@uu.is', phone: '5854000', registry: '470103-2990', licence: '2019-001', role: 'reseller' }
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