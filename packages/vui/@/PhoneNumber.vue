<script setup lang="ts">
import { dropLast, takeLast, o } from "geri"
import { PhoneIcon } from "vui/@"
import { computed } from "vue"

const props = defineProps<{
	no: number|string
}>()
const str = computed(() => {
	const no    = `${props.no}`
	const last4 = takeLast(4)(no)
	const then3 = o<string, string, string>(takeLast(3), dropLast(4))(no)
	const rest  = dropLast(7)(no)

	return `${rest} ${then3} ${last4}`
})

</script>

<template>
	<a :href="`tel:${no}`" class="inline-flex no-underline items-center">
		<PhoneIcon class="w-4 mr-1"></PhoneIcon>
		<span>{{ str }}</span>
	</a>
</template>