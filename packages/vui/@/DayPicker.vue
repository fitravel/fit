<script setup lang="ts">
import { computed } from "vue"
import DatePickerHeader from "./DatePickerHeader.vue"
import DayPickerCell from "./DayPickerCell.vue"
import { localize, isNil, o, addIndex, map, repeat, compose } from "geri"
import { useVModel } from "@vueuse/core"
import { addDays, addMonths, getDay, getDaysInMonth, getMonth, getYear, isAfter, isBefore, setDay, subDays, subMonths } from "date-fns";

const props = defineProps<{
	modelValue: Date;
	navDate: Date;
	startDate?: Date;
	endDate?: Date;
}>()
const emit = defineEmits([
	'update:modelValue',
	'update:navDate',
	'prev',
	'next',
	'click-label'
])

//DATES
const model = useVModel(props)
const nav   = useVModel(props, 'navDate')

const currentMonth = computed(() => getMonth(nav.value))
const currentYear  = computed(() => getYear(nav.value))
const createDate   = (i: number) => new Date(currentYear.value, currentMonth.value, i)
const isAfterStart = (d: Date) => isNil(props.startDate) ? true : isAfter(d, subDays(props.startDate, 1))
const isBeforeEnd  = (d: Date) => isNil(props.endDate) ? true : isBefore(d, addDays(props.endDate, 1))

// CELLS
interface DayPickerCell {
	type: 'weekday'|'date'|'gap';
	value: any;
	isActive: boolean;
}
const cells = computed(() => {
	const firstWeekday  = getDay(nav.value)
	const daysInMonth   = getDaysInMonth(nav.value)
	const createWeekday = (_i: {}, index: number): DayPickerCell => ({ type: 'weekday', value: localize(setDay(new Date(), index), 'EE'), isActive: false })
	const createGap     = (): DayPickerCell => ({ type: 'gap', value: null, isActive: false })

	const createCalendarDay = (_i: {}, index: number): DayPickerCell => {
		const type     = 'date'
		const value    = createDate(index+1)
		const isActive = isAfterStart(value) && isBeforeEnd(value)
		return { type, value, isActive }
	}
	const createCells = (fn: (_i: any, index: number) => DayPickerCell, n: number) => addIndex(map)(fn)(repeat({})(n))

	return [
		...createCells(createWeekday, 7),
		...createCells(createGap, firstWeekday),
		...createCells(createCalendarDay, daysInMonth)
	]
})

// HEADER
const label        = computed(() => localize(createDate(1), 'MMMM yyyy'))
const disablePrev  = computed(() => !isAfterStart(subDays(nav.value, 1)))
const disableLabel = false
const disableNext  = computed(() => !isBeforeEnd(addMonths(nav.value, 1)))

function onPrevClick () {
	nav.value = subMonths(nav.value, 1)
	emit('prev')
}
function onNextClick () {
	nav.value = addMonths(nav.value, 1)
	emit('next')
}

</script>

<template>
	<div class="day-picker">
		<DatePickerHeader v-bind="{ label, disablePrev, disableLabel, disableNext }"
			@prev="onPrevClick" @click-label="$emit('click-label')" @next="onNextClick"
		/>
		<div class="cells">
			<DayPickerCell v-for="cell of cells" v-model="model" v-bind="{ ...cell }"/>
		</div>
	</div>
</template>