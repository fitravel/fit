<script setup lang="ts">
import { Page } from "../@"
import { DataTable, Heading, PencilIcon, Anchor, UsersIcon, LightningBoltIcon, ThumbUpIcon, 
	UserAddIcon, TerminalIcon, TagIcon, LicenceNumber, Email } from "vui/@"
import { UsersIcon as OutlinedUsersIcon, LightningBoltIcon as OuutlinedLightningBoltIcon } from "@heroicons/vue/outline"
import { useUsers } from "heimdall"
import { onMounted } from "vue"
import { localize } from "geri"
import RegistryNumber from "vui/@/RegistryNumber.vue"
import PhoneNumber from "vui/@/PhoneNumber.vue"

const users = useUsers()

onMounted(() => users.fetchAll())

</script>

<template>
	<Page admin>
		<section class="mb-8">
			<Heading>
				Óstaðfestir aðgangar

				<template #icon>
					<OutlinedUsersIcon></OutlinedUsersIcon>
				</template>
			</Heading>
			<DataTable v-if="users.unverified.length"
				:cols="[
					{ header: 'Sótt um', key: 'created' },
					{ header: 'Ferðaskrifstofa', key: 'name' },
					{ header: 'Kennitala', key: 'registry', col: 'text-center' },
					{ header: 'Leyfisnúmer', key: 'licence', col: 'text-center' },
					{ header: 'Nafn tengiliðs', key: 'contact', col: 'text-center' },
					{ header: 'Netfang', key: 'email', col: 'text-center' },
					{ header: 'Símanúmer', key: 'phone', col: 'text-center' },
					{ header: 'Samþykkja', key: 'id', col: 'text-center' },
				]"
				:rows="users.unverified"
			>

				<template #cell:created="{ value }">
					{{ localize(value, "do MMM yyyy — HH:mm") }}
				</template>
				<template #cell:id="{ value }">
					<a href="#" @click.prevent="users.verify(value, true)">
						<ThumbUpIcon class="w-6"></ThumbUpIcon>
					</a>
				</template>

				<template #cell:registry="{ value }">
					<RegistryNumber :no="value"></RegistryNumber>
				</template>

				<template #cell:licence="{ value }">
					<LicenceNumber :no="value"></LicenceNumber>
				</template>

				<template #cell:phone="{ value }">
					<PhoneNumber :no="value"></PhoneNumber>
				</template>

				<template #cell:email="{ value }">
					<Email :address="value"></Email>
				</template>
			</DataTable>
			<div v-else class="border border-green-400 bg-green-200 p-4 text-center text-green-900 opacity-50">
				Það eru engir óstaðfestir aðgangar
			</div>
		</section>

		<section>
			<Heading>
				Aðgangar

				<template #icon>
					<UsersIcon></UsersIcon>
				</template>

				<template #sidebar>
					<Anchor to="/user" class="flex no-underline items-center">
						<UserAddIcon class="w-6 mr-1"></UserAddIcon>
						<span class="text-sm font-normal">
							Stofna nýjan aðgang
						</span>
					</Anchor>
				</template>
			</Heading>

			<DataTable v-if="users.verified.length"
				:cols="[
					{ header: 'Ferðaskrifstofa', key: 'name' },
					{ header: 'Kennitala', key: 'registry', col: 'text-center' },
					{ header: 'Leyfisnúmer', key: 'licence', col: 'text-center' },
					{ header: 'Nafn tengiliðs', key: 'contact', col: 'text-center' },
					{ header: 'Netfang', key: 'email', col: 'text-center' },
					{ header: 'Símanúmer', key: 'phone', col: 'text-center' },
					{ header: 'Réttindi', key: 'role', col: 'text-center' },
					{ header: 'Virkur', key: 'isActive', col: 'text-center' },
					{ header: 'Breyta', key: 'id', col: 'text-center' }
				]"
				:rows="users.verified"
			>
				<template #cell:isActive="{ value, row }">
					<a href="#" @click.prevent="() => users.toggle(row.id, true)">
						<LightningBoltIcon v-if="value" class="w-6"></LightningBoltIcon>
						<OuutlinedLightningBoltIcon v-else class="w-6 text-gray-400"></OuutlinedLightningBoltIcon>
					</a>
				</template>

				<template #cell:id="{ value }">
					<Anchor :to="`/user/${value}`">
						<PencilIcon class="w-6"></PencilIcon>
					</Anchor>
				</template>

				<template #cell:registry="{ value }">
					<RegistryNumber :no="value"></RegistryNumber>
				</template>

				<template #cell:licence="{ value }">
					<LicenceNumber :no="value"></LicenceNumber>
				</template>

				<template #cell:phone="{ value }">
					<PhoneNumber :no="value"></PhoneNumber>
				</template>

				<template #cell:email="{ value }">
					<Email :address="value"></Email>
				</template>

				<template #cell:role="{ value }">
					<span class="inline-block w-6">
						<TerminalIcon v-if="value === 'admin'"></TerminalIcon>
						<TagIcon v-if="value === 'reseller'"></TagIcon>
					</span>
				</template>
			</DataTable>
			<div v-else class="border border-red-400 bg-red-200 p-4 text-center text-red-900 opacity-50">
				Það eru engir staðfestir aðgangar
			</div>
		</section>
	</Page>
</template>