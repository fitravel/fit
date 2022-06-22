<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { TextField, ActionButton } from "vui/@"
</script>

<template>
	<Page>
		<div class="h-full grid items-center">
			<form id="login" class="mx-auto w-full max-w-[24rem]">
				<h2>Nýskráning</h2>
				<TextField label="Nafn" class="w-full"/>
				<TextField label="Kennitala" class="w-full"/>
				<TextField label="Netfang" class="w-full"/>
				<TextField label="Símanúmer" class="w-full"/>
				<TextField label="Veldu lykilorð" type="password" class="w-full"/>
				<TextField label="Endurtaktu lykilorð" type="password" class="w-full"/>
				<ActionButton class="mt-8">
					Skrá inn
				</ActionButton>
			</form>
		</div>
	</Page>
</template>