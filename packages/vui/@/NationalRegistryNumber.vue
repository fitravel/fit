<script setup lang="ts">
import { take, takeLast } from "geri"

defineProps<{
	no: number|string
}>()

</script>

<template>
	<span>{{ take(6)(`${no}`) }}-{{ takeLast(4)(`${no}`) }}</span>
</template>