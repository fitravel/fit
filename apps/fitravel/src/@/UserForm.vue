<script setup lang="ts">
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

const name        = ref('')
const email       = ref('')
const phone       = ref('')
const contact     = ref('')
const registry    = ref('')
const licence     = ref('')
const role        = ref('reseller')
const password    = ref('')
const passsynonym = ref('')

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
		role.value     = users.user.role
	}
})
const onSubmit = () => {
	users.update({ id: props.id }, {
		name, email, phone, contact, registry, licence
	})
}
</script>

<template>
	<form id="user" class="mx-auto w-full max-w-[32rem]" @submit.prevent="onSubmit">
		<h2 class="col-span-3">
			{{ label }}
		</h2>
		<p>
			Það þarf að fylla út alla reiti
		</p>


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
				Lykilorð þarf að vera ekki styttra en 8 slög, verður að innihalda a.m.k. 1 hástaf, 1 lágstaf, 1 tölu og 1 óvenjulegan karakter (t.d. !, # eða @)
			</p>

			<TextField v-model="password" label="Veldu lykilorð" type="password"></TextField>
			<TextField v-model="passsynonym" label="Endurtaktu lykilorð" type="password"></TextField>
		</div>

		

		<div class="col-span-3 flex gap-8 mt-12">
			<ActionButton>
				{{ action }}
			</ActionButton>

			<label class="flex items-center" v-if="!auth.user.isTerms">
				<input type="checkbox" class="mr-2"/>
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

</style>