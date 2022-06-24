<script setup lang="ts">
defineProps<{
	dangerZone?: boolean;
}>()
</script>

<template>
	<button class="field--button" :class="{ 'danger-zone': dangerZone }">
		<div>
			<slot/>
		</div>
	</button>
</template>