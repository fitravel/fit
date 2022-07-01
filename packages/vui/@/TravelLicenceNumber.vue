<script setup lang="ts">
import { take, takeLast } from "geri"

defineProps<{
	no: number|string
}>()

</script>

<template>
	<span>{{ take(4)(`${no}`) }}-{{ takeLast(3)(`${no}`) }}</span>
</template>