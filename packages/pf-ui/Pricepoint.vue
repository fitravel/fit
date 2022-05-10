<script setup lang="ts">
import { pricepoint } from "fn"

defineProps<{
	adults: number;
	children?: number;
	infants?: number;
	prefix?: string;
	suffix?: string;
}>()
</script>

<template>
	<span>{{ prefix }}{{ pricepoint({ adults, children, infants }) }} {{ suffix }}</span>
</template>