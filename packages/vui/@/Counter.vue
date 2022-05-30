<script setup lang="ts">
import { watch } from "vue"
import { useVModel } from "@vueuse/core"
import { PlusIcon, MinusIcon } from "vui/@"

const props = defineProps<{
	modelValue: number;
	label: string;
	min?: number;
	max?: number;
}>()

const model = useVModel(props)
watch(model, (i) => {
	const n = i as number
	const { min = 0, max = 10 } = props
	if (n < min) model.value = min
	if (n > max) model.value = max
})
</script>

<template>
	<label class="field--counter">
		<div class="label">
			{{ label }}
		</div>
		<div class="field grid grid-cols-3 grid-rows-2">
			<input readonly v-model.number="model" class="value col-span-2 row-span-2"/>
			<button @click="model++" class="col-span-1 row-span-1 h-7 grid items-center">
				<PlusIcon class="h-3 w-3 mx-auto"/>
			</button>
			<button @click="model--" class="col-span-1 row-span-1 h-7 grid items-center">
				<MinusIcon class="h-3 w-3 mx-auto"/>
			</button>
		</div>
	</label>
</template>