<script setup lang="ts">
import { localize, isk } from "geri"
import { TableIcon, ActionAnchor, PencilIcon, Anchor } from "vui/@"
import DataTable, { type DataTableColumn } from "vui/@/DataTable.vue"
import { computed } from "vue"
import { useAuth } from "heimdall"

const props = defineProps<{
	id?: number
}>()

const auth   = useAuth()
const isSolo = computed(() => !!(props.id ?? 0))

const columns = computed<DataTableColumn[]>(() => {
	console.log(isSolo.value, props.id)
	const cols = []

	if (!isSolo.value) cols.push({ header: 'Tilboð', key: 'title' })
	cols.push(
		{ header: 'Birtingardagur', key: 'published' },
		{ header: 'Áfangastaður', key: 'destination' },
		{ header: 'Tímabil', key: 'dates' },
		{ header: 'Athugasemdir', key: 'comment' },
		{ header: 'Sæti í boði', key: 'available', col: 'text-center' },
		{ header: 'Sæti seld', key: 'sold', col: 'text-center' },
		{ header: 'Verð p/sæti p/flug', key: 'price', col: 'text-center' }
	)
	if (!isSolo.value) cols.push({ header: 'Flugáætlun', key: 'outbound', col: 'text-center' })
	if (auth.isAdmin) cols.push({ header: 'Breyta', key: 'id', col: 'text-center' })

	return cols
})
</script>

<template>
	<DataTable :cols="columns" :rows="[
			{ id: 1, title: 'Keflavík | Verona 2022-2023', destination: 'Verona', sold: 0, available: 20, dateFrom: '2022-7-03', dateTo: '2023-08-01', comment: 'Án tösku', price: 20000, published: '2022-07-01' }
		]"
	>
		<template #cell:dates="{ row }">
			{{ localize(new Date(row.dateFrom), 'do MMM yyyy') }} – {{ localize(new Date(row.dateTo), 'do MMM yyyy')}}
		</template>

		<template #cell:outbound="{ row }">
			<ActionAnchor :to="`/schedule/${row.id}`" label="Skoða" class="inline-flex">
				<template #icon><TableIcon/></template>
			</ActionAnchor>
		</template>

		<template #cell:price="{ value }">
			{{ isk(value) }}
		</template>

		<template #cell:published="{ value }">
			{{ localize(value, 'do MMM yyyy') }}
		</template>

		<template #cell:id="{ value }">
			<Anchor :to="`/product/${value}`">
				<PencilIcon class="w-6"/>
			</Anchor>
		</template>
	</DataTable>
</template>