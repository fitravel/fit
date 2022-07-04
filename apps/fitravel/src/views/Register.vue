<script setup lang="ts">
import { Page, UserForm } from "../@"
import { UserIcon } from "vui/@"
import { ref } from "vue"

const isSubmitted = ref(false)
</script>

<template>
	<Page centered>
		<div class="mx-auto w-full max-w-[32rem] text-center" v-if="isSubmitted">
			<h2>Skráning tókst!</h2>
			<p>
				Athugaðu að það þarf að staðfesta aðganginn áður en hann verður virkur, sem getur tekið nokkra virka daga
			</p>
		</div>
		<UserForm show-terms label="Nýskráning" action="Sækja um aðgang" @submit="isSubmitted = true" v-else>
			<template #icon><UserIcon/></template>
		</UserForm>
	</Page>
</template>