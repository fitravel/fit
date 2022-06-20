<script setup lang="ts">
import { ChevronRightIcon, ChevronLeftIcon } from "vui/@"

defineProps<{
	disablePrev: boolean;
	disableLabel: boolean;
	disableNext: boolean;
	label: string;
}>()

defineEmits([
	'prev',
	'click-label',
	'next'
])

</script>

<template>
	<header class="grid grid-cols-6 pb-2">
		<button :disabled="disablePrev" @click="$emit('prev')" class="prev"> 
			<ChevronLeftIcon class="w-6"/>
		</button>
		<button :disabled="disableLabel" @click="$emit('click-label')" class="label"> 
			{{ label }} 
		</button>
		<button :disabled="disableNext" @click="$emit('next')" class="next"> 
			<ChevronRightIcon class="w-6"/> 
		</button>
	</header>
</template>

<style lang="postcss" scoped>
.prev {
	@apply grid items-center justify-items-center border border-solid rounded
		 disabled:border-0 disabled:bg-black  disabled:cursor-not-allowed;
}
.label {
	@apply col-span-4 disabled:bg-black disabled:cursor-not-allowed disabled:hover:text-white;
}
.next {
	@apply grid items-center justify-items-center border border-solid  rounded
		 disabled:border-0 disabled:bg-black  disabled:cursor-not-allowed;
}
</style>