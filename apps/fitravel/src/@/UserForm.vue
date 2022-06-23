<script setup lang="ts">
import { TextField, ActionButton, SelectField } from "vui/@"

defineProps<{
	label: string;
	action: string;
	showRoles: boolean;
	showDelete: boolean;
}>()
</script>

<template>
	<form id="login" class="mx-auto w-full max-w-[50rem] grid grid-cols-3 gap-4">
		<h2 class="col-span-3">
			{{ label }}
		</h2>
		<div class="col-span-1">
			<TextField label="Nafn ferðaskrifstofu" class="w-full"/>
			<TextField label="Netfang" class="w-full"/>
			<TextField label="Símanúmer" class="w-full"/>
		</div>
		
		<div class="col-span-1">
			<TextField label="Kennitala" class="w-full"/>
			<TextField label="Leyfisnúmer á ferðaskrifstofuleyfi" class="w-full"/>

			<SelectField v-if="showRoles" 
				label="Réttindi"
				:items="[
					{ text: 'reseller', value: 'reseller' },
					{ text: 'admin', value: 'admin' }
				]"
			/>
		</div>
		<div class="col-span-1">
			<TextField label="Veldu lykilorð" type="password" class="w-full"/>
			<TextField label="Endurtaktu lykilorð" type="password" class="w-full"/>
		</div>

		<div class="col-span-3">
			<ActionButton class="mt-8">
				{{ action }}
			</ActionButton>
		</div>

		<div v-if="showDelete" class="pt-16 col-span-3">
			<p class="text-red-700 font-bold">
				ATH! Passa sig hvar maður klikkar! Það er ekki hægt að bakfæra!
			</p>
			<ActionButton danger-zone>
				Eyða notanda
			</ActionButton>
		</div>
	</form>
</template>