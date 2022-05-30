<script setup lang="ts">
import { computed, ref, type Ref } from "@vue/reactivity"
import { compose, find, last, prop, split } from "ramda"
import { SelectField, Counter, MultiSelectField } from "vui/@"
import { Page } from "vui/@/hermes"

const items = [
	{ text: 'foo', value: 0 },
	{ text: 'bar', value: 1 },
	{ text: 'moo', value: 2 },
	{ text: 'boo', value: 3 },
	{ text: 'bla', value: 4 }
]
interface SelectOption {
	text: string;
	value: any;
	disabled?: boolean;
}
// OWNERS

const types: SelectOption[] = [
	{ text: 'Bara flug', value: 2 },
	{ text: 'Flug og gisting', value: 1 },
	{ text: 'Pakkar', value: 3 }
]
const type = ref()

// DIRECTION

const origins: SelectOption[] = [
	{ text: 'Keflavík / KEF', value: 1 },
	{ text: 'Akureyri / AEY', value: 215 }
]
const origin = ref(1)
const chosenOrigin = computed(() => compose(last, split('/'), prop('text'), find((i: SelectOption) => i.value === origin.value))(origins))

const directions: Ref<SelectOption[]> = computed(() => [
	{ text: `Bæði til og frá ${chosenOrigin.value}`, value: '' },
	{ text: `Bara frá ${chosenOrigin.value}`, value: 'outbound' },
	{ text: `Bara til ${chosenOrigin.value}`, value: 'inbound' }
])
const direction = ref('')

// AVAILABILITY

const minSeats = ref(1)
const maxSeats = ref(300)

//

const destinations = ref([])

</script>

<template>
	<Page title="Flugviti">
		<div class="w-full px-6">
			<aside class="slab grid grid-cols-4 gap-6">
				<SelectField :items="types" v-model="type" label="Veldu tegund"/>
				<SelectField :items="[]" label="Veldu Odin owner"/>
				<SelectField :items="origins" v-model="origin" label="Veldu lókal flugvöll"/>
				<SelectField :items="directions" v-model="direction" label="Veldu átt"/>
			</aside>
			<aside class="slab grid grid-cols-8 gap-6">
				<MultiSelectField :items="items" v-model="destinations" label="Afmarka við áfangastaði" class="col-span-2 row-span-2"/>
				<MultiSelectField :items="items" label="Afmarka við flugfélag" class="col-span-2 row-span-2"/>

					<SelectField :items="items" label="Veldu tegund"  class="col-span-2 row-span-1"/>
					<SelectField :items="items" label="Veldu tegund"  class="col-span-2 row-span-1"/>
						<Counter :min="0" :max="300" label="Min. sæti" v-model="minSeats"/>
						<Counter :min="0" :max="300" label="Max. sæti" v-model="maxSeats"/>

				
			</aside>
			<table>
				<thead>

				</thead>
				<tbody>

				</tbody>
			</table>
		</div>
	</Page>
</template>

<style scoped lang="postcss">

</style>