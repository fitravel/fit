<script setup lang="ts">
import { useAlerts, useJanus } from "vui/fn"

// const { isLoggedIn } = useJanus()
const alerts = useAlerts()
</script>

<template>
	<section class="min-h-screen min-w-screen">
		<header id="page-header" v-if="$slots.header">
			<slot name="header"/>
		</header>

		<main>
			<slot/>
		</main>

		<footer id="page-footer" v-if="$slots.footer">
			<slot name="footer"/>
		</footer>

		<!-- <section id="hermes" class="fixed w-full py-4 px-6 bg-black text-white" v-if="isLoggedIn">
			<slot name="hermes"/>
		</section> -->

		<section id="page-alerts" v-if="$slots.alert">
			<article v-for="alert of alerts.active" :id="`page-alert-${alert.id}`">
				<slot name="alert" v-bind="{ ...alert, close: () => alerts.dismiss(alert.id) }"/>
			</article>

		</section>

	</section>
</template>