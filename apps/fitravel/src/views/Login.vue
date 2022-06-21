<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { TextField, ActionButton } from "vui/@"
</script>

<template>
	<Page>
		<div class="h-full grid items-center">
			<form id="login" class="mx-auto w-full max-w-[24rem]">
				<h2>Innskráning</h2>
				<TextField label="Notandi" class="w-full"/>
				<TextField label="Lykilorð" type="password" class="w-full"/>
				<ActionButton class="mt-8">
					Skrá inn
				</ActionButton>
			</form>
		</div>
	</Page>
</template>