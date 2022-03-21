<script setup lang="ts">
import { BasePage } from "fit-kit"
import Alert from "./Alert.vue"
</script>

<template>
	<BasePage class="">
		<template #header>


		</template>

		<slot/>

		<template #footer>

		</template>

		<template #alert="item">
			<Alert v-bind="item" @close="item.close"/>
		</template>

		<template #hermes>
			<slot name="hermes"/>
		</template>
		
	</BasePage>
</template>