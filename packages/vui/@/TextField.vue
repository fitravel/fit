<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { ref, watch } from "vue";

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
		<textarea v-model="model" v-bind="$attrs" class="input" v-if="large"/>
		<input v-model="model" v-bind="$attrs" class="input" v-else/>
	</label>
</template>