<script setup lang="ts">
import { computed, ref } from "@vue/reactivity"
import { map, slice, length } from "geri"
import { watch } from "vue";
import { ChevronRightIcon, ChevronLeftIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon, IconButton } from "vui/@"

interface DataTableColumn {
	key: string;
	header: string;
	th?: string;
	td?: string;
}
const props = defineProps<{
	cols: DataTableColumn[];
	rows: Record<string, any>[];
	paginated?: number;
}>()
const itemsPerPage = computed(() => props.paginated ?? 0)
const totalItems   = computed(() => length(props.rows ?? []))
const totalPages   = computed(() => Math.ceil(totalItems.value/itemsPerPage.value))

const page = ref(1)
watch(page, (n) => {
	if (n < 1) page.value = 1
	if (n > totalPages.value) page.value = totalPages.value
})

const isOnFirstPage = computed(() => page.value === 1)
const isOnLastPage  = computed(() => page.value === totalPages.value)

const items = computed(() => {
	if (itemsPerPage.value > 0) {
		const n = (page.value * itemsPerPage.value)
		return slice(n - itemsPerPage.value, n)(props.rows)
	}
	return props.rows
})

</script>

<template>
	<div class="data-table">
		<table class="w-full">

			<thead>
				<tr>
					<th v-for="(col, x) of cols" :class="`col-${x} ${col.th ?? ''}`">
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
					<td v-for="(col, y) of cols" :class="`${col.key} col-${y} ${col.td ?? ''}`">
						<slot :name="`cell:${col.key}`" v-bind="{ row, col, value: row?.[col.key] ?? null, rowIndex: x, colIndex: y }">
							<div class="value">
								{{ row[col.key] }}
							</div>
						</slot>
					</td>
				</tr>
			</tbody>

			
		</table>
		<div class="pagination w-full flex pt-3">
			<div class="self-start h-9 text-right w-full pr-6 grid items-center">
				<span class="dim">Síða {{ page }} af {{ totalPages }}</span>
			</div>
			<nav class="flex h-9 self-end">
				<IconButton @click="page = 1" :class="{ disabled: isOnFirstPage }">
					<slot name="pagination:first" v-bind="{ disabled: isOnFirstPage }">
						<ChevronDoubleLeftIcon/>
					</slot>
				</IconButton>
				<IconButton @click="page--" :class="{ disabled: isOnFirstPage }">
					<slot name="pagination:prev"  v-bind="{ disabled: isOnFirstPage }">
						<ChevronLeftIcon/>
					</slot>
				</IconButton>

				<input class="field h-full mt-0 w-12 px-3 text-center" v-model.number="page"/> 

				<IconButton @click="page++" :class="{ disabled: isOnLastPage }">
					<slot name="pagination:next" v-bind="{ disabled: isOnLastPage }">
						<ChevronRightIcon/>
					</slot>
				</IconButton>
				<IconButton @click="() => page = totalPages" :class="{ disabled: isOnLastPage }">
					<slot name="pagination:last" v-bind="{ disabled: isOnLastPage }">
						<ChevronDoubleRightIcon/>
					</slot>
				</IconButton>
			</nav>
		</div>
	</div>
</template>

<style lang="postcss">
.dim {
	@apply opacity-50;
}
.data-table {
	tbody {
		@apply bg-black bg-opacity-30 rounded font-extralight text-xs font-mono;
	}

	tr {
		@apply border-b border-neutral-800;
	}
	td, th {
		@apply text-center;

		.label {
			@apply h-12 grid items-center font-normal;
		}
		.value {
			@apply grid items-center min-h-[3rem] justify-center;

			a {
				@apply border-b inline-block w-min;
			}
		}
	}
	
	.pagination {
		.disabled {
			@apply cursor-not-allowed opacity-50;
		}
	}
}
</style>