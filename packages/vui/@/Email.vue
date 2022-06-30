<script setup lang="ts">
import { MailIcon } from "vui/@"

defineProps<{
	address: string
}>()

</script>

<template>
	<a :href="`mailto:${address}`" class="no-underline inline-flex items-center">
		<MailIcon class="w-4 mr-1"></MailIcon>
		<slot v-bind="{ value: address }">
			{{ address }}
		</slot>
	</a>
</template>