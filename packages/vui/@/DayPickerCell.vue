<script setup lang="ts">
import { computed } from "vue"
import { useVModel } from "@vueuse/core"
import { isSameDay } from "date-fns"
import { PopoverButton } from "vui/@"
import { localize } from "geri"

const props = defineProps<{
	modelValue: Date;
	value: string|Date;
	type: 'weekday'|'date'|'gap';
	isActive: boolean;
}>()
const emit = defineEmits([
	'update:modelValue',
	'select'
])
const model    = useVModel(props)
const selected = computed(() => props.type === 'date' ? isSameDay(props.modelValue, props.value as Date) : false)

function onSelect () {
	if (props.isActive) {
		model.value = props.value
		emit('select', props.value)
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