<script setup lang="ts">
import { compose, filter, prop, sort, splitAt } from "fn"
import { ref, computed } from "vue"
import { useOfferama, type Offer } from "gygax"
import { HotelOffer, Block } from "pf-kit"
import { isAfter } from "date-fns"

const props = defineProps<{
	slug: string;
	spotlight?: boolean;
}>()
const store  = useOfferama()
const offers = ref<Offer[]>([])
const title  = ref<string>()

whenever(() => store.isReady, () => {
	if (props.slug ?? false) {
		const x = store.bySlug(props.slug) ?? { offers: [], title: '' }
		const spotlight = props.spotlight ?? false
		offers.value = compose(sort((a, b) => isAfter(a.query.from, b.query.from) ? 1 : -1), filter(i => spotlight ? i.spotlight : true))(x.offers)
		title.value  = x.title
	}
})
</script>

<template>
	<Block :title="title">
		<div class="tw-grid tw-grid-cols-4 tw-gap-6">
			<HotelOffer v-for="i of offers" v-bind="i"/>
		</div>
	</Block>
</template>