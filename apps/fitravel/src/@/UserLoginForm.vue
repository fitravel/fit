<script setup lang="ts">
import { onMounted } from "vue"
import { TextField, ActionButton, Anchor } from "vui/@"
import { useLogin, useAuth } from "heimdall"
import { whenever } from "@vueuse/core"
import { useRouter } from "vue-router";

const { email, password, login, error } = useLogin()
const auth = useAuth(), router = useRouter()

whenever(() => auth.isLoggedIn, () => router.push('/dash'))
onMounted(() => { if (auth.isLoggedIn) router.push('/dash') })
</script>

<template>
	<form id="user-login" class="mx-auto max-w-[24rem]" :class="{ error }" @submit.prevent="login">
		<h2>Innskráning</h2>
		<p v-if="error" class="text-red-500">
			{{ error }}
		</p>
		<TextField v-model="email" label="Notandi (netfang)"></TextField>
		<TextField v-model="password" label="Lykilorð" type="password"></TextField>
		<div class="flex">
			<ActionButton class="mt-8">
				Skrá inn
			</ActionButton>
			<small class="grid items-center pt-8 px-4">
				<span>Ekki með aðgang? <Anchor to="/register">Nýskráning</Anchor></span>
			</small>
		</div>
	</form>
</template>