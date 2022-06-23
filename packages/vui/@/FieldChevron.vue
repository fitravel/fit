<script setup lang="ts">
import { XIcon, ChevronDownIcon } from "vui/@"

defineProps<{
	open: boolean;
	nullable: boolean;
}>()
</script>

<template>
	<span class="h-6 w-6 mr-4 transition" :class="{ 'z-40 rotate-180 duration-100 ease-out': open }">
		<XIcon v-if="open && nullable" class="h-4 w-4" @click="$emit('nulled')"/>
		<ChevronDownIcon v-else/>
	</span>
</template>