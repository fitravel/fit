<script setup lang="ts">
import { Page } from "vui/base"
import { BruceLogo } from "vui/hermes"
// import { useBruce } from "vui"

// const { data } = useBruce()

</script>

<template>
	<Page class="mt-36 text-center">
		<BruceLogo class="mx-auto"/>

		<h2 class="py-4">Sources</h2>
		<section class="flex gap-4 justify-center">
			<router-link v-for="source of data" :to="`/${source.slug}/`">
				<article class="shadow w-52 h-52 bg-cover hover:shadow-xl" :style="{ 'background-image': `url(${source.hero})` }"/>
			</router-link>
		</section>

	</Page>
</template>s