<script setup lang="ts">
import { computed } from "vue"
import { useVModel } from "@vueuse/core"
import { isSameDay } from "date-fns"
import { PopoverButton } from "vui/@"
import { localize } from "geri"

const props = defineProps<{
	modelValue: Date|null;
	value: string|Date;
	type: 'weekday'|'date'|'gap';
	isActive: boolean;
}>()
const emit = defineEmits([
	'update:modelValue',
	'select'
])
const model    = useVModel(props, 'modelValue')
const selected = computed(() => props.type === 'date' ? isSameDay(props.modelValue as Date, props.value as Date) : false)

function onSelect () {
	if (props.isActive) {
		const date = new Date(props.value)
		model.value = date
		emit('select', date)
	}
}
</script>

<template>
	<PopoverButton class="cell day-picker-cell" 
		:class="{ [type]: true, selected, active: isActive }"
		:disabled="!isActive" @click="onSelect"
	>
		{{ type === 'date' ? localize(value, 'd') : value }}
	</PopoverButton>
</template>