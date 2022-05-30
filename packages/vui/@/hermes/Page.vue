<script setup lang="ts">
import { Page as BasePage } from "vui/@"
import { HermesLogo } from "vui/@/hermes"

defineProps<{
	title: string;
}>()
</script>

<template>
	<BasePage class="bg-neutral-900 p-6">
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