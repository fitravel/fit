<script setup lang="ts">

defineProps<{
	label?: string
	level?: number
}>()

</script>

<template>
	<component :is="`h${level ?? 2}`" class="flex relative">
		<span v-if="$slots.icon" class="w-6 mr-2 flex">
			<slot name="icon"></slot>
		</span>
		<span>
			<slot name="default">
				{{ label }}
			</slot>
		</span>
		<span v-if="$slots.sidebar" class="absolute right-1 bottom-4">
			<slot name="sidebar"></slot>
		</span>
	</component>
</template>