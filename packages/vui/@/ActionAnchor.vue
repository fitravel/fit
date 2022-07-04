<script setup lang="ts">
import { Anchor } from "vui/@"

defineProps<{
	to: string
	label: string
}>()

</script>

<template>
	<Anchor :to="to" class="flex no-underline items-center">
		<span class="inline-block w-6 mr-1" v-if="$slots.icon">
			<slot name="icon"/>
		</span>
		<span class="text-sm font-normal">
			{{ label }}
		</span>
	</Anchor>
</template>