<script setup lang="ts">
import { compareAsc, parse } from "date-fns"
import { split, o, map, compose, join, values, type R, any, isEmpty, flatten, sort, head, last, localize } from "geri"
import { useAuth } from "heimdall"
import { computed, onMounted, ref } from "vue"
import { routerKey, useRouter } from "vue-router"
import { TextField, PencilIcon, Heading } from "vui/@"
import ActionButton from "vui/@/ActionButton.vue"
import { useAlerts } from "vui/fn"
import { useProduct } from "../useProduct"
import { useProducts } from "../useProducts"

const props = defineProps<{
	id?: number
	label: string
}>()

const product  = useProduct()
const router   = useRouter()
const alerts   = useAlerts()

const title       = ref('')
const destination = ref('')
const available   = ref('')
const price       = ref('')
const comment     = ref('')
const outSchedule = ref('')
const inSchedule  = ref('')

//

const isNew = computed(() => !(props?.id ?? 0))

//

const parseDate = (i: string) => parse(i, 'd.M.yyyy HH:mm', new Date())
const toFields = ([ code, origin, destination, dateFrom, dateTo ]: string[]) => {
	const departure = parseDate(dateFrom)
	const arrival   = parseDate(dateTo)
	return { code, origin, destination, departure, arrival }
}
const refactor = compose(map(toFields), map(split('\t')), split('\n'))
const defactor = compose(join('\n'), map(compose(join('\t'), values, (i) => ({ ...i, departure: localize(i.departure, 'd.M.yyyy HH:mm'), arrival: localize(i.arrival, 'd.M.yyyy HH:mm') })))) as (a: R[]) => string
const outbound = computed(() => refactor(outSchedule.value))
const inbound  = computed(() => refactor(inSchedule.value))

const allDates = computed(() => {
	const extractDates = compose(flatten, map(({ departure, arrival }) => [ new Date(departure), new Date(arrival) ])) as (a: R[]) => Date[]
	return sort(compareAsc)([ ...extractDates(outbound.value), ...extractDates(inbound.value) ])
})

onMounted(async () => {
	if (!isNew.value) {
		const i: R = await product.get(props.id ?? 0)

		title.value       = i.title
		destination.value = i.destination
		comment.value     = i.comment
		available.value   = i.available
		price.value       = i.price
		outSchedule.value = defactor(i.outbound)
		inSchedule.value  = defactor(i.inbound)
	}
})
const onSubmit = async () => {
	try {
		if (any(isEmpty)([ 
			title.value, available.value, price.value,
			outSchedule.value, inSchedule.value
		])) throw 'Það þarf að fylla í alla reiti nema athugasemdir'

		const dateFrom = head(allDates.value)
		const dateTo   = last(allDates.value)

		if (isNew.value) await product.create({
			title, destination, outbound, inbound, 
			dateFrom, dateTo, available, price, comment
		})
		else await product.update({ id: props.id }, {
			title, destination, outbound, inbound, 
			dateFrom, dateTo, available, price, comment
		})
		const message = isNew.value ? `Tilboð „${title.value}“ hefur verið stofnað` : `Tilboð „${title.value}“ hefur verið uppfært`
		alerts.add({ type: 'success', message })
		router.push('/dash')
	}
	catch (e) {
		alerts.add({ type: 'error', message: `${e}` })
	}
}
</script>

<template>
	<form id="product" class="w-full max-w-[72rem] mx-auto" @submit.prevent="onSubmit">
		<Heading>
			{{ label }}

			<!-- <template #icon>
				<PencilIcon></PencilIcon>
			</template> -->
		</Heading>

		<div class="grid grid-cols-2 gap-8">
			<div>
				<TextField v-model="title" label="Titill"></TextField>
				<TextField v-model="destination" label="Áfangastaður"></TextField>
				
				<div class="grid grid-cols-2 gap-8">
					<TextField v-model="available" label="Sæti í boði" type="number"></TextField>
					<TextField v-model="price" label="Verð á sæti" type="number"></TextField>
				</div>

				<TextField v-model="comment" large label="Athugasemdir" class="min-h-[8rem]"></TextField>
			</div>
			
			<div>
				<TextField v-model="outSchedule" large label="Flug út" class="min-h-[11.5rem]"></TextField>
				<TextField v-model="inSchedule" large label="Flug heim" class="min-h-[11.5rem]"></TextField>
			</div>
		</div>

		<ActionButton class="mt-8">
			Skrá tilboð
		</ActionButton>
	</form>
</template>