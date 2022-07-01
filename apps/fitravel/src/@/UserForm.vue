<script setup lang="ts">
import { any, isEmpty, verifyEmail, verifyPassword } from "geri";
import { useAuth, useUsers } from "heimdall"
import { onMounted, ref } from "vue";
import { TextField, ActionButton, SelectField, Anchor } from "vui/@"

const props = defineProps<{
	label: string
	action: string
	id?: number
	showRoles?: boolean
	showDelete?: boolean
}>()

const auth  = useAuth()
const users = useUsers()

const isSubmitted = ref(false)
const alerts      = ref([] as string[])
const name        = ref('')
const email       = ref('')
const phone       = ref('')
const contact     = ref('')
const registry    = ref('')
const licence     = ref('')
const password    = ref('')
const passsynonym = ref('')
const isTerms     = ref(false)

onMounted(async () => {
	const { id = 0 } = props

	if (id) {
		await users.fetch(id)

		name.value     = users.user.name
		email.value    = users.user.email
		phone.value    = users.user.phone
		contact.value  = users.user.contact
		registry.value = users.user.registry
		licence.value  = users.user.licence
	}
})
const onSubmit = async () => {
	alerts.value = []

	try {
		if (password.value !== passsynonym.value) {
			throw 'Lykilorðin stemma ekki'
		}
		verifyEmail(email.value)
		verifyPassword(password.value)

		const isAnyNotFilled = any(isEmpty)([ 
			name.value, email.value, phone.value, contact.value,
			registry.value, licence.value, password.value
		])
		if (isAnyNotFilled) throw 'Það verður að fylla í alla reiti'
		if (!isTerms.value) throw 'Það verður að samþykkja skilmálana'

		if (props.id) {
			await users.update({ id: props.id }, {
				name, email, phone, contact, registry, licence
			})
		}
		else {
			const role = 'reseller'
			await users.create({
				name, email, contact, phone, registry,  
				licence, password, role, isTerms
			})
		}
		isSubmitted.value = true
	}
	catch (e) {
		alerts.value.push(e as string)
	}	
}
</script>

<template>
	<div class="mx-auto w-full max-w-[32rem] text-center" v-if="isSubmitted">
		<h2>Skráning tókst!</h2>
		<p>
			Athugaðu að það þarf að staðfesta aðganginn áður en hann verður virkur, sem getur tekið nokkra virka daga
		</p>
	</div>

	<form id="user" class="mx-auto w-full max-w-[32rem]" @submit.prevent="onSubmit" v-else>
		<h2 class="col-span-3">
			{{ label }}
		</h2>

		<ul class="text-red-500" v-if="alerts">
			<li v-for="alert of alerts">{{ alert }}</li>
		</ul>

		<div class="col-span-1">
			<h3>Upplýsingar vegna ferðaskrifstofu</h3>

			<TextField v-model="name" label="Nafn ferðaskrifstofu"></TextField>
			<TextField v-model="registry" label="Kennitala"></TextField>
			<TextField v-model="licence" label="Leyfisnúmer á ferðaskrifstofuleyfi"></TextField>
		</div>
		
		<div class="col-span-1">
			<h3>Upplýsingar vegna tengiliðs</h3>

			<TextField v-model="contact" label="Nafn tengiliðs"></TextField>
			<TextField v-model="email" label="Netfang (ath. er einnig notendanafn)"></TextField>
			<TextField v-model="phone" label="Símanúmer"></TextField>
		</div>

		<div class="col-span-1">
			<h3>Lykilorð</h3>
			<p>
				Lykilorðið má ekki vera styttra en 8 slög, verður að innihalda a.m.k. 1 hástaf, 1 lágstaf, 1 tölu og 1 óvenjulegan karakter (t.d. !, # eða @)
			</p>
			<TextField v-model="password" label="Veldu lykilorð" type="password"></TextField>
			<TextField v-model="passsynonym" label="Endurtaktu lykilorð" type="password"></TextField>
		</div>

		<div class="col-span-3 flex gap-8 mt-12">
			<ActionButton>
				{{ action }}
			</ActionButton>

			<label class="flex items-center" v-if="!id">
				<input v-model="isTerms" type="checkbox" class="mr-2">
				<span>Ég hef lesið og samþykki <Anchor to="/terms">skilmála</Anchor></span>
			</label>
		</div>

		<!-- <div v-if="showDelete ?? false" class="pt-16 col-span-3">
			<p class="text-red-700 font-bold">
				ATH! Passa sig hvar maður klikkar! Það er ekki hægt að bakfæra!
			</p>
			<ActionButton danger-zone>
				Eyða notanda
			</ActionButton>
		</div> -->
	</form>
</template>

<style lang="postcss" scoped>

#user {
	p {
		@apply text-base opacity-75 pb-0;
	}
}
.label::after {
	content: ' *',
	@apply text-red-500;
}

</style>