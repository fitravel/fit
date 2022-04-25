<script setup lang="ts">
import { useJanus } from "vui"
import { ref } from "vue"

const { requestToken } = useJanus()
const email = ref('')
const isSubmitted = ref(false)

function onSubmit () {
	isSubmitted.value = true
	requestToken(email.value)
}
</script>

<template>
	<Page id="login-page">
		<section id="login-form" class="grid content-center w-screen h-screen">
			<div class="mx-auto max-w-sm p-6 -mt-36 text-center">
				<Logo class="mb-4"/>
				<form class="flex" @submit.prevent="onSubmit" v-if="!isSubmitted">
					<input v-model="email" type="text" placeholder="email" class="w-2/3 border border-stone-800 text-stone-600 rounded-l-xl py-1 px-2"/>
					<button class="w-1/3 text-white bg-stone-800 rounded-r-xl uppercase font-bold text-xs hover:bg-stone-800">
						Let me in!
					</button>
				</form>
				<div v-else>
					<p></p>
				</div>
			</div>
		</section>
	</Page>
</template>