<script setup lang="ts">
defineProps<{
	title?: string;
}>()
</script>

<template>
	<section class="tw-px-6">
		<h3 v-if="title" class="swoosh tw-mt-10 tw-relative">
			{{ title }}
		</h3>
		<slot/>
	</section>
</template>