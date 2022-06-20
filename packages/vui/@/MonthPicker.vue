<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { addYears, getMonth, getYear, subYears } from "date-fns";
import { localize, isNil, repeat, addIndex, map } from "geri"
import { computed } from "vue"
import { isAfter, isBefore } from "date-fns"
import DatePickerHeader from "./DatePickerHeader.vue"
import MonthPickerCell from "./MonthPickerCell.vue"

const props = defineProps<{
	modelValue: Date;
	navDate: Date;
	startDate?: Date;
	endDate?: Date;
}>()
const emit = defineEmits([
	'update:modelValue',
	'prev',
	'next',
	'click-label'
])

// DATES
const model = useVModel(props)
const nav   = useVModel(props, 'navDate')

const currentYear  = computed(() => getYear(nav.value))
const createMonth  = (i: number) => new Date(currentYear.value, i, 1)
const isAfterStart = (d: Date) => isNil(props.startDate) ? true : isAfter(d, props.startDate)
const isBeforeEnd  = (d: Date) => isNil(props.endDate) ? true : isBefore(d, props.endDate)

// CELLS
interface MonthPickerCell {
	index: number;
	value: Date;
	isActive: boolean;
}
const createCell = (_i: any, index: number) => {
	const value    = createMonth(index)
	const isActive = isAfterStart(value) && isBeforeEnd(value)
	return { modelValue: model.value, index, value, isActive } as MonthPickerCell
}
const cells = computed(() => addIndex(map)(createCell)(repeat({})(12)))

// HEADER
const label        = computed(() => localize(nav.value, 'yyyy'))
const disablePrev  = computed(() => !isAfterStart(new Date(currentYear.value-1, 12, 31)))
const disableLabel = true
const disableNext  = computed(() => !isBeforeEnd(new Date(currentYear.value+1, 1, 1)))

function onPrevClick () {
	nav.value = subYears(nav.value, 1)
	emit('prev')
}
function onNextClick () {
	nav.value = addYears(nav.value, 1)
	emit('next')
}
</script>

<template>
	<div class="month-picker">
		<DatePickerHeader v-bind="{ label, disablePrev, disableLabel, disableNext }"
			@prev="onPrevClick" @click-label="$emit('click-label')" @next="onNextClick"
		/>
		<section class="cells">
			<MonthPickerCell v-for="cell of cells" v-bind="cell"/>
		</section>
	</div>
</template>