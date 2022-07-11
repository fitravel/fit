<script setup lang="ts">
import { localize, isk } from "geri"
import { TableIcon, ActionAnchor, PencilIcon, Anchor } from "vui/@"
import DataTable, { type DataTableColumn } from "vui/@/DataTable.vue"
import { computed, onMounted } from "vue"
import { useAuth } from "heimdall"
import { useProducts } from "../useProducts"
import { addWeeks } from "date-fns"

const props = defineProps<{
	id?: number
}>()

const auth     = useAuth()
const products = useProducts()
const isSolo   = computed(() => !!(props.id ?? 0))

products.fetch()

const columns = computed<DataTableColumn[]>(() => {
	const cols = []

	if (!isSolo.value) cols.push({ header: 'Tilboð', key: 'title' })
	cols.push(
		{ header: 'Birtingardagur', key: 'created' },
		{ header: 'Losnar', key: 'free' },
		{ header: 'Áfangastaður', key: 'destination' },
		{ header: 'Tímabil', key: 'dates' },
		{ header: 'Athugasemdir', key: 'comment' },
		{ header: 'Sæti í boði', key: 'available', col: 'text-center' },
		// { header: 'Sæti seld', key: 'sold', col: 'text-center' },
		{ header: 'Verð per leið', key: 'price', col: 'text-center' }
	)
	if (!isSolo.value) cols.push({ header: 'Flugáætlun', key: 'outbound', col: 'text-center' })
	if (auth.isAdmin) cols.push({ header: 'Breyta', key: 'id', col: 'text-center' })

	return cols
})
const table = computed(() => ({
	cols: columns.value,
	rows: products.items,
	noResults: 'Það eru engin tilboð'
}))
</script>

<template>
	<DataTable v-bind="table">
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

		<template #cell:created="{ value }">
			{{ localize(value, 'do MMM yyyy') }}
		</template>

		<template #cell:free="{ row }" v-if="auth.isAdmin">
			{{ localize(addWeeks(new Date(row.created), 3), 'do MMM yyyy') }}
		</template>

		<template #cell:id="{ value }">
			<Anchor :to="`/product/${value}`">
				<PencilIcon class="w-6"/>
			</Anchor>
		</template>
	</DataTable>
</template>