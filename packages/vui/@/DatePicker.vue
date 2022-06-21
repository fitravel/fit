<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { getDate, setDate } from "date-fns"
import { computed, onMounted, ref, watch } from "vue"
import { Popover, PopoverButton, PopoverPanel } from "vui/@"
import DayPicker from "./DayPicker.vue"
import MonthPicker from "./MonthPicker.vue"

const props = defineProps<{
	modelValue: Date|null;
	label?: string;
	startDate?: Date;
	endDate?: Date;
	disabled?: boolean;
}>()

const isDisabled = computed(() => props.disabled ?? false)
const model      = useVModel(props)
const firstDate  = computed(() => props.startDate ?? new Date())
const nav        = ref(new Date())
const view       = ref<'days'|'months'>('days')

onMounted(() => nav.value = firstDate.value)
watch(nav, i => {
	if (getDate(i) !== 1) {
		nav.value = setDate(nav.value, 1)
	}
})
</script>

<template>
	<label class="field field--date-picker">
		<div class="label" v-if="label">
			{{ label }}
		</div>
		<Popover class="relative">
			<PopoverButton v-slot="{ open }" :disabled="isDisabled" class="input">
				{{ model }}
			</PopoverButton>
			<PopoverPanel class="dropdown">
				<DayPicker v-show="view === 'days'"
					v-model="model"
					v-model:nav-date="nav"
					:start-date="firstDate"
					:end-date="endDate"
					@click-label="view = 'months'"
				/>
				<MonthPicker v-show="view === 'months'"
					v-model="model"
					v-model:nav-date="nav"
					:start-date="firstDate"
					:end-date="endDate"
					@click-label="view = 'days'"
					@select="view = 'days'"
				/>
			</PopoverPanel>
		</Popover>
	</label>
</template>

<style lang="postcss">
.field--date-picker {
	
}
</style>