<script setup lang="ts">
import { computed, ref, type Ref } from "@vue/reactivity"
import { compose, filter, find, last, map, prop, split, flatten, uniqBy, o, type R, byId } from "geri"
import { SelectField, Counter, DataTable, IconButton, MapIcon, CodeIcon, DatePicker } from "vui/@"
import { Page } from "vui/@/hermes"
import { useOwners, type Owner } from "gygax"
import { useFlightTable } from "odin"
import { format } from "date-fns"
import locale from "date-fns/locale/is"
import { onMounted, watch } from "vue"
import { asyncComputed } from "@vueuse/core"

const { schedule, selectedOwnerType, ownerTypes, ownersOfSelectedType, selectedOwner, directions, direction } = useFlightTable()


// const dest = computed(() => {
// 	return map(i => destules.query({ oid, origin: 1, destination: 12 }))(destinations.value)
// })

// DIRECTION

// const origins: SelectOption[] = [
// 	{ text: 'Keflavík / KEF', value: 1 },
// 	{ text: 'Akureyri / AEY', value: 215 }
// ]
// const origin = ref(1)
// const chosenOrigin = computed(() => compose(last, split('/'), prop('text'), find((i: SelectOption) => i.value === origin.value))(origins))

// const directions: Ref<SelectOption[]> = computed(() => [
// 	{ text: `Bæði til og frá ${chosenOrigin.value}`, value: '' },
// 	{ text: `Bara frá ${chosenOrigin.value}`, value: 'outbound' },
// 	{ text: `Bara til ${chosenOrigin.value}`, value: 'inbound' }
// ])
// const direction = ref('')

// // AVAILABILITY

// const minSeats = ref(1)
// const maxSeats = ref(300)

//


const dimIfLocal = (code: string) => code === 'KEF' || code === 'AEY' ? 'opacity-50' : ''
const severity   = (seats: number = 0) => {
	if (seats < 1) return 'no-severity'
	if (seats < 10) return 'low-severity'
	if (seats >= 10 && seats < 20) return 'medium-severity'
	return 'high-severity'
}
const getAvailability = (id: number) => find((i: R) => i.id === id)(schedule.value)?.available ?? null

</script>

<template>
	<Page title="Flugviti">
		<div class="w-full px-6">
			<aside class="slab grid grid-cols-8 grid-rows-1 gap-6 grid-flow-row">
				<SelectField :items="ownerTypes" v-model="selectedOwnerType" label="Veldu tegund" class="col-span-1 row-span-1"/>
				<SelectField :items="ownersOfSelectedType" v-model="selectedOwner" label="Veldu Odin owner" class="col-span-1 row-span-1"/>
				<!-- <SelectField :items="origins" v-model="origin" label="Frá dagsetningu" class="col-span-2 row-span-1"/>
				<SelectField :items="origins" v-model="origin" label="Fram að dagsetningu" class="col-span-2 row-span-1"/> -->
				<SelectField :items="directions" v-model="direction" label="Veldu átt" class="col-span-2 row-span-1"/>
				<DatePicker class="col-span-1 row-span-1" label="Frá dags."/>
				<DatePicker class="col-span-1 row-span-1" label="Fram að dags."/>
			</aside>
			<!-- <aside class="slab grid grid-cols-8 grid-rows-2 grid-flow-col gap-6">
				<SelectField :items="items" v-model="destinations" label="Afmarka við áfangastaði" class="col-span-2 row-span-1"/>
				<SelectField :items="items" label="Afmarka við flugfélag" class="col-span-2 row-span-1"/>

				<Counter :min="0" :max="300" label="Min. sæti" v-model="minSeats" class="col-span-1 row-span-1"/>
				<Counter :min="0" :max="300" label="Max. sæti" v-model="maxSeats" class="col-span-1 row-span-1"/>
				
			</aside> -->
			<section class="slab">
				<DataTable
					:paginated="12"
					:cols="[
						{ header: 'Frá → Til', key: 'origin', td: 'text-sm' },
						{ header: 'Brottför', key: 'departure', td: 'text-left' },
						{ header: 'Óseld sæti', key: 'available', td: 'text-left' },
						{ header: 'Flugkóði', key: 'code', td: 'dim text-left' },
						{ header: 'Odin ID', key: 'id', td: 'dim text-center' },
						{ header: 'Læsingar', key: 'returnLimit', td: 'dim text-center' },
						{ header: '', key: 'ctrl', td: 'text-left' },
						{ header: 'PNL listi', key: 'pnl', td: 'dim text-center' },
					]"
					:rows="schedule"
				>
					<template #cell:origin="{ row }">
						<div class="value">
							<span>
								<span :class="dimIfLocal(row.origin.code)">
									{{ row.origin.code }}
								</span>
								<span class="opacity-50">
									→
								</span>
								<span :class="dimIfLocal(row.destination.code)">
									{{ row.destination.code }}
								</span>
							</span>
						</div>
					</template>
					
					<template #cell:departure="{ value }">
						<div class="value">
							<span>
								<span class="opacity-100">{{ format(new Date(value), 'do MMM', { locale }) }}</span>
								<span class="opacity-50 ml-2">{{ format(new Date(value), 'hh:mm') }}</span>
							</span>
						</div>
					</template>

					<template #cell:available="{ value }">
						<div class="value">
							<span v-if="value !== null" :class="severity(value)">
								{{ value }}
							</span>
						</div>
					</template>

					<template #cell:id="{ value }">
						<div class="value">
							<a :href="`https://fitravel.corivoapp.com/Pages/Inventory/Flights/Edit.aspx?ItemID=${value}`" target="_blank">
								{{ value }}
							</a>
						</div>
					</template>

					<template #cell:returnLimit="{ value }">
						<div class="value">
							<span v-for="id of value" class="return-flight">
								<a :href="`https://fitravel.corivoapp.com/Pages/Inventory/Flights/Edit.aspx?ItemID=${id}`" target="_blank">
									{{ id }}
								</a>
								<span v-if="getAvailability(id) !== null" :class="severity(getAvailability(id))">({{ getAvailability(id) }})</span>
							</span>
						</div>
					</template>
					
					<template #cell:ctrl="{ value }">
						<div class="value">
							<div class="flex">
								<IconButton class="">
									<MapIcon/>
								</IconButton>
								<IconButton class="">
									<CodeIcon/>
								</IconButton>
							</div>
						</div>
					</template>
				</DataTable>
			</section>
		</div>
	</Page>
</template>

<style scoped lang="postcss">
.available .value {
	@apply text-sm;
}
.return-flight {
	a {
		@apply mr-2;
	}
	&::after {
		content: ', ';
	}
	&:last-child::after {
		content: '';
	}
}
.no-severity {
	@apply text-neutral-700;
}
.low-severity {
	color: greenyellow;
}
.medium-severity {
	color: orange;
}
.high-severity {
	color: red;
}

</style>