<script setup lang="ts">
import { Page } from "../@"
import { localize } from "geri"
import { DataTable, Heading, CalendarIcon } from "vui/@"
import { parse } from "date-fns"

const columns = [
	{ header: 'Flugkóði', key: 'code' },
	{ header: 'Frá → til', key: 'destination', col: 'text-center' },
	{ header: 'Brottför', key: 'departure', col: 'text-left' },
	{ header: 'Lendir', key: 'arrival', col: 'text-left' },
]
const outbound = [
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '3.7.2022 06:00', arrival: '3.7.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '10.7.2022 06:00', arrival: '10.7.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '17.7.2022 06:00', arrival: '17.7.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '24.7.2022 06:00', arrival: '24.7.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '31.7.2022 06:00', arrival: '31.7.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '7.8.2022 06:00', arrival: '7.8.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '14.8.2022 06:00', arrival: '14.8.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '21.8.2022 06:00', arrival: '21.8.2022 12:00' },
	{ code: 'NO7952', origin: 'Keflavík', destination: 'Verona', departure: '28.8.2022 06:00', arrival: '28.8.2022 12:00' },
]
const inbound = [
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '3.7.2022 13:00', arrival: '3.7.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '10.7.2022 13:00', arrival: '10.7.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '17.7.2022 13:00', arrival: '17.7.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '24.7.2022 13:00', arrival: '24.7.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '31.7.2022 13:00', arrival: '31.7.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '7.8.2022 13:00', arrival: '7.8.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '14.8.2022 13:00', arrival: '14.8.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '21.8.2022 13:00', arrival: '21.8.2022 15:20' },
	{ code: 'NO7953', origin: 'Verona', destination: 'Keflavík', departure: '28.8.2022 13:00', arrival: '28.8.2022 15:20' },
]	

const parseDate = (i: string) => parse(i, 'd.M.yyyy HH:mm', new Date())
</script>

<template>
	<Page secure>
		<Heading>
			Flugáætlun — Keflavík | Verona 2022-2023

			<template #icon>
				<CalendarIcon></CalendarIcon>
			</template>
		</Heading>

		<section>
			<ul class="mb-4">
				<li><strong>Áfangastaður:</strong> Verona</li>
				<li><strong>Tímabil:</strong> 3. júlí 2022 – 1. ágúst 2023</li>
				<li><strong>Sæti í boði:</strong> 20</li>
				<li><strong>Seld sæti:</strong> 0</li>
				<li><strong>Athugasemdir:</strong> Án tösku</li>
			</ul>
		</section>

		<section class="w-full grid grid-cols-2 gap-8">
			<div>
				<h3>Flug út</h3>
				<DataTable :cols="columns" :rows="outbound">
					<template #cell:destination="{ row }">
						<div>
							<span>{{ row.origin }}</span> <span>→</span> <span>{{ row.destination }}</span>
						</div>
					</template>
					<template #cell:departure="{ value }">
						{{ localize(parseDate(value), 'do MMM yyyy — HH:mm') }}
					</template>
					<template #cell:arrival="{ value }">
						{{ localize(parseDate(value), 'do MMM yyyy — HH:mm') }}
					</template>
				</DataTable>
			</div>

			<div>
				<h3>Flug heim</h3>
				<DataTable :cols="columns" :rows="inbound">
					<template #cell:destination="{ row }">
						<div>
							<span>{{ row.origin }}</span> <span>→</span> <span>{{ row.destination }}</span>
						</div>
					</template>
					<template #cell:departure="{ value }">
						{{ localize(parseDate(value), 'do MMM yyyy — HH:mm') }}
					</template>
					<template #cell:arrival="{ value }">
						{{ localize(parseDate(value), 'do MMM yyyy — HH:mm') }}
					</template>
				</DataTable>
			</div>
		</section>
	</Page>
</template>