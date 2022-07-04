<script setup lang="ts">
import { Page } from "../@"
import { DataTable, Heading, PencilIcon, Anchor, UsersIcon, LightningBoltIcon, 
	UserAddIcon, TerminalIcon, TagIcon, TravelLicenceNumber, NationalRegistryNumber, Email, PhoneNumber, ActionAnchor } from "vui/@"
import { UsersIcon as OutlinedUsersIcon, LightningBoltIcon as OuutlinedLightningBoltIcon } from "@heroicons/vue/outline"
import { useUsers } from "heimdall"
import { UnverifiedUserTable, VerifiedUserTable } from "../@"
import { onMounted } from "vue"

const users = useUsers()

onMounted(() => users.fetchAll())

</script>

<template>
	<Page admin>
		<section class="mb-8">
			<Heading label="Óstaðfestir aðgangar">
				<template #icon><OutlinedUsersIcon/></template>
			</Heading>
			<UnverifiedUserTable/>
		</section>

		<section>
			<Heading label="Aðgangar">
				<template #icon><UsersIcon/></template>
				<template #sidebar>
					<ActionAnchor to="/user" label="Stofna nýjan aðgang">
						<template #icon><UserAddIcon/></template>
					</ActionAnchor>
				</template>
			</Heading>
			<VerifiedUserTable/>		
		</section>
	</Page>
</template>