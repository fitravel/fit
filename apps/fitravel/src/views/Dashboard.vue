<script setup lang="ts">
import { Page } from "../@"
import { type DataTableColumn } from "vui/@/DataTable.vue"
import { DataTable, Heading, TableIcon, Anchor, DocumentAddIcon, CloudDownloadIcon } from "vui/@"
import { localize, isk } from "geri"
import { useAuth } from "heimdall"

const cols: DataTableColumn[] = [
	{ header: 'Titill', key: 'title' },
	{ header: 'Áfangastaður', key: 'destination', col: 'text-center' },
	{ header: 'Tímabil', key: 'dates' },
	{ header: 'Sæti í boði', key: 'available', col: 'text-center' },
	{ header: 'Sæti seld', key: 'sold', col: 'text-center' },
	{ header: 'Verð p/sæti', key: 'price', col: 'text-center' },
	{ header: 'Athugasemdir', key: 'comment' },
	{ header: 'Flugáætlun', key: 'id' }
]
const auth = useAuth()
</script>

<template>
	<Page secure>
		<Heading>
			Markaðstorg

			<template #icon>
				<TableIcon></TableIcon>
			</template>

			<template #sidebar>
				<Anchor to="/product" class="flex no-underline items-center" v-if="auth.isAdmin">
					<DocumentAddIcon class="w-6 mr-1"></DocumentAddIcon>
					<span class="text-sm font-normal">
						Búa til tilboð
					</span>
				</Anchor>
			</template>
		</Heading>

		<DataTable 
			:cols="cols"
			:rows="[
				{ id: 1, title: 'Keflavík | Verona 2022-2023', destination: 'Verona', sold: 0, available: 20, dateFrom: '2022-7-03', dateTo: '2023-08-01', comment: 'Án tösku', price: 20000 }
			]"
		>
			<template #cell:dates="{ row }">
				{{ localize(new Date(row.dateFrom), 'do MMM yyyy') }} – {{ localize(new Date(row.dateTo), 'do MMM yyyy')}}
			</template>

			<template #cell:id="{ value, row }">
				<div class="flex gap-4">
					<Anchor :to="`/schedule/${value}`" class="inline-flex items-center no-underline">
						<TableIcon class="w-6 mr-2"></TableIcon>
						<span>Skoða áætlun</span>
					</Anchor>
					<!-- <a href="#" class="inline-flex items-center no-underline">
						<CloudDownloadIcon class="w-6 mr-2"></CloudDownloadIcon>
						<span>Sækja á <strong>.csv</strong> sniði</span>
					</a> -->
				</div>
			</template>
			<template #cell:price="{ value }">
				{{ isk(value) }}
			</template>
		</DataTable>
	</Page>
</template>