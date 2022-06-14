<script setup lang="ts">
import { Page as BasePage } from "vui/@"
import { HermesLogo } from "vui/@/hermes"

defineProps<{
	title: string;
}>()
</script>

<template>
	<BasePage class="p-6 max-w-[1600px] mx-auto">
		<template #header>
			<div class="w-full text-center mb-6">
				<HermesLogo class="inline-block"/>
				<h1 class="font-bold text-xl">
					{{ title }}
				</h1>
			</div>
		</template>
		<slot />
	</BasePage>
</template>