<script setup lang="ts">
import { computed, useAttrs } from "vue"
import { startsWith } from "fn"

const attrs = useAttrs()
const props = defineProps({
	to: { type: String, default: '/' }
})
const isExternal = computed(() => startsWith('http')(props.to))
const tag        = computed(() => isExternal.value ? 'a' : 'router-link')

const _bind = computed(() => {
	const i = { ...attrs }
	if (isExternal.value) {
		i.href   = props.to
		i.target = '_blank'
	}
	else {
		i.to = props.to
	}
	return i
})
</script>

<template>
	<component :is="tag" v-bind="_bind">
		<slot/>
	</component>
</template>