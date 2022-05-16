<script setup lang="ts">
import { isk, o, vanityPrice } from "geri"

const props = defineProps<{
	amount: number;
	vanity?: boolean;
}>()
const price = (i: number) => (props.vanity ?? false) ? o(isk, vanityPrice)(i) : isk(i)
</script>

<template>
	<div class="tw-italic">
		<span>Verð frá</span> <strong class="tw-font-black tw-ml-0.5 tw-text-3xl">{{ price(amount) }}</strong>
	</div>
</template>