<script setup lang="ts">
import { useVModel } from "@vueuse/core"

const props = defineProps<{
	modelValue: string;
	label?: string;
	large?: boolean;
}>()
const model = useVModel(props)

</script>

<template>
	<label class="field field--text">
		<div class="label" v-if="label">
			{{ label }}
		</div>
		<component :is="large ?? false ? 'textarea' : 'input'" v-model="model" class="input" v-bind="$attrs"/>
	</label>
</template>