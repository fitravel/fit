<script setup lang="ts">
import { any, isEmpty, verifyEmail, verifyPassword } from "geri";
import { useAuth, useUsers, type User } from "heimdall"
import { computed, onMounted, ref } from "vue";
import { TextField, ActionButton, Heading, Anchor } from "vui/@"

const props = defineProps<{
	label: string
	action: string
	id?: number
	showRoles?: boolean
	showTerms?: boolean
}>()
const emit = defineEmits([
	'submit'
])

const auth  = useAuth()
const users = useUsers()

const alerts      = ref([] as string[])
const name        = ref('')
const email       = ref('')
const phone       = ref('')
const contact     = ref('')
const registry    = ref('')
const licence     = ref('')
const password    = ref('')
const passterm    = ref('')

const isAdmin  = ref(false)
const isActive = ref(true)
const isTerms  = ref(false)
const isSignUp = computed(() => !(props.id ?? 0))

onMounted(async () => {
	if (!isSignUp.value) {
		await users.fetch(props.id as number)
		const user = users.user as User

		name.value     = user.name
		email.value    = user.email
		phone.value    = user.phone
		contact.value  = user.contact
		registry.value = user.registry
		licence.value  = user.licence
		isAdmin.value  = user.role === 'admin'
		isActive.value = !!user.isActive
		isTerms.value  = !!user.isTerms
	}
})
const onSubmit = async () => {
	alerts.value = []

	const checkPass = () => {
		if (password.value !== passterm.value) {
			throw 'Lykilorðin stemma ekki'
		}
		verifyPassword(password.value)
	}

	try {
		verifyEmail(email.value)

		if (isSignUp.value) {
			if (password.value) checkPass()
			else throw 'Verður að velja lykilorð'
		}
		else if (password.value) {
			checkPass()
		}

		const isAnyEmpty = any(isEmpty)([ 
			name.value, email.value, phone.value, contact.value,
			registry.value, licence.value
		])
		if (isAnyEmpty) throw 'Það verður að fylla í alla reiti'
		if (!isSignUp.value && !isTerms.value) throw 'Það verður að samþykkja skilmálana'

		// 
		const role = isAdmin.value ? 'admin' : 'reseller'

		if (!isSignUp.value) {
			await users.update({ id: props.id }, {
				name, email, phone, contact, registry, 
				licence, role, isActive
			})
		}
		else {
			await users.create({
				name, email, contact, phone, registry,  
				licence, password, role, isTerms, isActive
			})
		}
		emit('submit')
	}
	catch (e) {
		alerts.value.push(e as string)
	}	
}
</script>

<template>
	<form id="user" class="mx-auto w-full max-w-[80rem]" @submit.prevent="onSubmit">
		<Heading :label="label">
			<template #icon><slot name="icon"/></template>
			<template #sidebar v-if="showRoles">
				<div class="flex gap-4 text-lg font-normal">
					<label class="flex gap-2 items-center" for="admin">
						<input v-model="isActive" name="admin" type="checkbox"/>
						<span>Virkur aðgangur</span>
					</label>

					<label class="flex gap-2" for="admin">
						<input v-model="isAdmin" name="admin" type="checkbox"/>
						<span>Gefa <strong>admin</strong> réttindi</span>
					</label>
				</div>
			</template>
		</Heading>

		<ul class="text-red-500" v-if="alerts">
			<li v-for="alert of alerts">{{ alert }}</li>
		</ul>

		<div class="grid grid-cols-3 gap-8">
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
				<TextField v-model="password" label="Veldu lykilorð" type="password"></TextField>
				<TextField v-model="passterm" label="Endurtaktu lykilorð" type="password"></TextField>
				<p class="pt-4 text-xs">
					Lykilorðið má ekki vera styttra en 8 slög, verður að innihalda a.m.k. 1 hástaf, 1 lágstaf, 1 tölu og 1 óvenjulegan karakter (t.d. !, # eða @)
				</p>
			</div>
		</div>

		<div class="col-span-3 flex gap-8 mt-12">
			<ActionButton>
				{{ action }}
			</ActionButton>

			<label class="flex items-center" v-if="isSignUp && showTerms">
				<input v-model="isTerms" type="checkbox" class="mr-2">
				<span>Ég hef lesið og samþykki <Anchor to="/terms">skilmála</Anchor></span>
			</label>
		</div>
	</form>
</template>

<style lang="postcss" scoped>
h3 {
	@apply mt-2;
}
</style>