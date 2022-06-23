<script setup lang="ts">
import { TextField, ActionButton, Anchor } from "vui/@"
</script>

<template>
	<form id="user-login" class="mx-auto max-w-[24rem]">
		<h2>Innskráning</h2>
		<TextField label="Notandi (netfang)" class="w-full"/>
		<TextField label="Lykilorð" type="password" class="w-full"/>
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