<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { localize } from "geri"
import { getMonth, isSameMonth } from "date-fns"
import { computed } from "vue"

const props = defineProps<{
	modelValue: Date;
	index: number;
	value: Date;
	isActive: boolean;
}>()
defineEmits([
	''
])
const text     = computed(() => localize(props.value, 'MMM'))
const selected = computed(() => isSameMonth(props.modelValue, props.value))
</script>

<template>
	<button :disabled="!isActive" @click="$emit('select', index)"
		:class="{ [text]: true, selected, active: isActive }"
	>
		{{ text }}
	</button>
</template>