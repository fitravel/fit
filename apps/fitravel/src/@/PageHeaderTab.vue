<script setup lang="ts">
import { Anchor } from "vui/@"
import { includes } from "ramda"
import { computed } from "vue"
import { useRoute } from "vue-router"
import { invoke } from "@vueuse/core"

const props = defineProps<{
	label: string
	to: string
	active?: () => boolean
}>()
const isActive = computed(() => invoke(props.active ?? (() => includes(props.to)(useRoute().path))))
</script>

<template>
	<Anchor :to="to" :class="{ active: isActive }"
		class="tab"
	>
		<span class="w-8 inline-block">
			<slot/>
		</span>
		<span>
			{{ label }}
		</span> 
	</Anchor>
</template>

<style lang="postcss" scoped>
#page-header {
	a.tab {
		@apply flex gap-2 text-lg no-underline font-bold items-center;

		&:not(.active) {
			@apply text-[#004287] opacity-50;
		}
	}
}
</style>