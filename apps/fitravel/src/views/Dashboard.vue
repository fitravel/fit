<script setup lang="ts">
import { Page, ProductTable } from "../@"
import { Heading, TagIcon, ActionAnchor, DocumentAddIcon } from "vui/@"
import { useAuth } from "heimdall"

const auth = useAuth()
</script>

<template>
	<Page secure>
		<Heading label="Markaðstorg">
			<template #icon><TagIcon/></template>
			<template #sidebar>
				<ActionAnchor to="/product" label="Búa til tilboð" v-if="auth.isAdmin">
					<template #icon><DocumentAddIcon/></template>
				</ActionAnchor>
			</template>
		</Heading>

		<ProductTable/>
	</Page>
</template>