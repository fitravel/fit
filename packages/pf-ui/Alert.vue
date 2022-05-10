<script setup lang="ts">
defineEmits([
	'close'
])
defineProps<{
	type: string;
	message: string;
	index: number;
}>()
</script>

<template>
	<div class="pf-alert" :class="{ type }">
		<div v-html="message"/>
		<button @click="$emit('close')">
			Loka
		</button>
	</div>
</template>