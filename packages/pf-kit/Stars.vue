<script setup lang="ts">
defineProps<{
	count: number;
}>()
</script>

<template>
	<div class="tw-bg-pf-brand tw-text-2xl tw-pb-0.5 tw-px-2">
		{{ '★'.repeat(count) }}
	</div>
</template>