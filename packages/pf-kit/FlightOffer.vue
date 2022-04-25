<script setup lang="ts">
import { useFlightOffer } from "odin"
import type { AvailabilityQuery } from "gygax"
import { format, isValid } from 'date-fns'
import isLocale from 'date-fns/locale/is'

const props = defineProps<{
	query: AvailabilityQuery
}>()

const { outbound, inbound, isOneWay, url, pricePerPax, isReady } = useFlightOffer(props.query)

function fixAirport (s: string = '') {
	switch (s) {
		case 'Alicante Airport': return 'Alicante'
		case 'Tenerife TFS': return 'Tenerife'
		case 'Las Palmas': return 'Gran Canaria'
		default: return s
	}
}
function date (d: string|Date) {
	const D = new Date(d)
	return isValid(D) ? format(D, 'do MMM', { locale: isLocale }) : ''
}
</script>

<template>
	<a :href="url" v-if="isReady && !isError">
		<article class="flight-offer tw-border-t tw-border-black">
			<div class="tw-flex">
				<div class="tw-grid tw-items-center md:tw-h-24 tw-text-center sm:tw-text-left tw-w-1/3">
					<div>
						<strong>{{ fixAirport(outbound?.origin.name) }}</strong> {{ isOneWay ? '→' : '↔' }} <strong>{{ fixAirport(outbound?.destination.name) }}</strong>,
						<br/>
						<span v-if="isOneWay">aðra leið</span>
						<span v-else>báðar leiðir</span>
					</div>
				</div>
				<div class="tw-text-center tw-grid tw-items-center md:tw-h-24 tw-w-1/3">
					<div v-if="isOneWay">
						{{ date(outbound?.departure) }}
					</div>
					<div v-else>
						{{ date(outbound?.departure) }} – {{ date(inbound?.departure) }}
					</div>
				</div>
				<div class="tw-grid tw-items-center md:tw-h-24 tw-w-1/3">
					<div class="tw-text-center sm:tw-text-right">
						<span>Verð frá</span> <strong class="tw-ml-0.5 price">{{ isk(pricePerPax) }}</strong>
					</div>
				</div>
				<div class="tw-grid tw-items-center md:tw-h-24">
					<a :href="url" class="action-button tw-mt-4 sm:tw-mt-0">
						Skoða tilboð
					</a>
				</div>
			</div>
		</article>
	</a>
</template>