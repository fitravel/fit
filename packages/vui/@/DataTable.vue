<script setup lang="ts">
import { computed, ref } from "@vue/reactivity"
import { map, slice, length, isEmpty } from "geri"
import { watch } from "vue";

export interface DataTableColumn {
	key: string
	header: string
	th?: string
	td?: string
	col?: string
}
const props = defineProps<{
	cols: DataTableColumn[]
	rows?: Record<string, any>[]
	paginated?: number
	noResults?: string
	loading?: boolean
}>()
const rows = computed(() => props.rows ?? [])

const itemsPerPage = computed(() => props.paginated ?? 0)
const totalItems   = computed(() => rows.value.length)
const totalPages   = computed(() => Math.ceil(totalItems.value/itemsPerPage.value))

const page = ref(1)
watch(page, (n) => {
	if (n < 1) page.value = 1
	if (n > totalPages.value) page.value = totalPages.value
})

const items = computed(() => {
	console.log(rows.value)
	if (itemsPerPage.value > 0) {
		const n = (page.value * itemsPerPage.value)
		return slice(n - itemsPerPage.value, n)(rows.value)
	}
	return rows.value
})
const isResultZero = computed(() => isEmpty(rows.value))

</script>

<template>


	<div class="data-table overflow-x-scroll pb-4 animate-in fade-in">
		<div v-if="loading" class="loader">
			<slot name="loader">
				Loading...
			</slot>
		</div>
		<div class="no-results" v-else-if="isResultZero">
			{{ noResults ?? 'Engar niðurstöður' }}
		</div>
		<div v-else>
			<table class="w-full">

				<thead>
					<tr>
						<th v-for="(col, x) of cols" :class="`col-${x} ${col.col ?? ''} ${col.th ?? ''}`">
							<slot :name="`header:${col.key}`">
								<div class="label">
									{{ col?.header ?? '' }}
								</div>
							</slot>
						</th>
					</tr>
				</thead>

				<tbody>
					<tr v-for="(row, x) of items" :class="`row-${x}`">
						<td v-for="(col, y) of cols" :class="`${col.key} col-${y} ${col.col ?? ''} ${col.td ?? ''}`">
							<slot :name="`cell:${col.key}`" v-bind="{ row, col, value: row?.[col.key] ?? null, rowIndex: x, colIndex: y }">
								<div class="value">
									{{ row[col.key] }}
								</div>
							</slot>
						</td>
					</tr>
				</tbody>

			</table>
		</div>
		<!-- <Paginator :page="page" :total-pages="totalPages" :total-items="totalItems" v-if="paginated"/> -->
	</div>
</template>

<style lang="postcss">

</style>