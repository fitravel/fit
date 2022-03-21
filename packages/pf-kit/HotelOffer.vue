<script setup lang="ts">
import { useHotelOffer } from "odin"
import type { AvailabilityQuery } from "gygax"
import { format, isValid } from 'date-fns'
import isLocale from 'date-fns/locale/is'
import { is, vanityPrice, isk, o } from "fn"
import { Price, Stars, Pricepoint } from "."

const props = defineProps<{
	query: AvailabilityQuery
}>()

const { hotel, room, stay, destination, url, pricePerPax, totalPrice, isReady } = useHotelOffer(props.query)

function date (d: string|Date) {
	const D = new Date(d)
	return isValid(D) ? format(D, 'do MMM', { locale: isLocale }) : ''
}
const location = computed(() => {
	switch (destination.value.id) {
		case 6: return 'Kanarí'
		case 480: return hotel.value?.place ?? ''
		default: return destination.value.name
	}
})
</script>

<template>
	<a :href="url" v-if="isReady">
		<article class="hotel-offer tw-h-96 tw-text-right tw-relative">
			<div class="location">{{ location }}</div>
			<div class="tw-text-lg tw-pb-0.5">{{ date(query.from) }} — {{ stay }}</div>
			<div :style="{ 'background-image': `url('${hotel.hero}')` }" class="tw-relative tw-h-60 tw-bg-black tw-bg-center tw-bg-cover">
				<h4 class="tw-absolute tw-text-white tw-bg-black tw-bottom-0 tw-right-0 tw-w-full tw-px-3 tw-py-0.5 tw-text-lg">{{ hotel.name }}</h4>
			</div>
			<Stars :count="hotel.stars" class="tw-absolute"/>
			<Price vanity :amount="pricePerPax"/>
			<Pricepoint v-bind="query" prefix="á mann m.v." class="tw-block -tw-mt-1"/>
		</article>
	</a>
</template>

<style lang="postcss" scoped>
.location {
	@apply tw-font-bira tw-text-left tw-z-30 tw-absolute tw-top-1 -tw-left-3 tw-text-4xl tw-transform -tw-rotate-4 tw-bg-pf-brand tw-px-3 tw-pb-1;
}
</style>