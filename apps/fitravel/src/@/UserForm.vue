<script setup lang="ts">
import { ref } from "vue";
import { TextField, ActionButton, SelectField } from "vui/@"

defineProps<{
	label: string;
	action: string;
	showRoles?: boolean;
	showDelete?: boolean;
}>()

const name = ref('')
const email = ref('')
const phone = ref('')
const registry = ref('')
const licence = ref('')
const role = ref('reseller')
const password = ref('')
const passwordRepeat = ref('')
</script>

<template>
	<form id="login" class="mx-auto w-full max-w-[32rem]">
		<h2 class="col-span-3">
			{{ label }}
		</h2>
		<div class="col-span-1">
			<TextField v-model="name" label="Nafn ferðaskrifstofu" class="w-full"/>
			<TextField v-model="email" label="Netfang" class="w-full"/>
			<TextField v-model="phone" label="Símanúmer" class="w-full"/>
		</div>
		
		<div class="col-span-1">
			<TextField v-model="registry" label="Kennitala" class="w-full"/>
			<TextField v-model="licence" label="Leyfisnúmer á ferðaskrifstofuleyfi" class="w-full"/>

			<SelectField v-if="showRoles ?? false" 
				v-model="role"
				label="Réttindi"
				:items="[
					{ text: 'reseller', value: 'reseller' },
					{ text: 'admin', value: 'admin' }
				]"
			/>
		</div>
		<div class="col-span-1">
			<TextField v-model="password" label="Veldu lykilorð" type="password" class="w-full"/>
			<TextField v-model="passwordRepeat" label="Endurtaktu lykilorð" type="password" class="w-full"/>
		</div>

		<label class="flex">
			<input type="checkbox"/>
			<span>Ég hef lesið og samþykki <Anchor to="/terms">skilmála</Anchor></span>
		</label>

		<div class="col-span-3">
			<ActionButton class="mt-8">
				{{ action }}
			</ActionButton>
		</div>

		<div v-if="showDelete ?? false" class="pt-16 col-span-3">
			<p class="text-red-700 font-bold">
				ATH! Passa sig hvar maður klikkar! Það er ekki hægt að bakfæra!
			</p>
			<ActionButton danger-zone>
				Eyða notanda
			</ActionButton>
		</div>
	</form>
</template>