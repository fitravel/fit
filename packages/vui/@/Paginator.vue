<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { computed } from "vue"
import { ChevronRightIcon, ChevronLeftIcon, ChevronDoubleRightIcon, ChevronDoubleLeftIcon, IconButton } from "vui/@"


const props = defineProps<{
	page: number
	totalPages: number
	totalItems: number
	perPage: number
}>()

const p = useVModel(props)

const isOnFirstPage = computed(() => p.value === 1)
const isOnLastPage  = computed(() => p.value === props.totalPages)

</script>

<template>
	<div class="pagination w-full flex pt-3">
		<div class="self-start h-9 text-right w-full pr-6 grid items-center">
			<span class="dim">Síða {{ p }} af {{ totalPages }}</span>
		</div>
		<nav class="flex h-9 self-end">
			<IconButton @click="p = 1" :class="{ disabled: isOnFirstPage }">
				<slot name="pagination:first" v-bind="{ disabled: isOnFirstPage }">
					<ChevronDoubleLeftIcon/>
				</slot>
			</IconButton>
			<IconButton @click="p--" :class="{ disabled: isOnFirstPage }">
				<slot name="pagination:prev"  v-bind="{ disabled: isOnFirstPage }">
					<ChevronLeftIcon/>
				</slot>
			</IconButton>

			<input class="field h-full mt-0 w-12 px-3 text-center" v-model.number="page"/> 

			<IconButton @click="p++" :class="{ disabled: isOnLastPage }">
				<slot name="pagination:next" v-bind="{ disabled: isOnLastPage }">
					<ChevronRightIcon/>
				</slot>
			</IconButton>
			<IconButton @click="() => p = totalPages" :class="{ disabled: isOnLastPage }">
				<slot name="pagination:last" v-bind="{ disabled: isOnLastPage }">
					<ChevronDoubleRightIcon/>
				</slot>
			</IconButton>
		</nav>
	</div>
</template>