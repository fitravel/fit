<script setup lang="ts">
import { Page, UserForm } from "../@"
import { PencilIcon } from "vui/@"
</script>

<template>
	<Page secure centered>
		<UserForm :id="+$route.params.id" label="Breyta aðgangi" action="Skrá breytingar" show-delete show-roles>
			<template #icon><PencilIcon/></template>
		</UserForm>
	</Page>
</template>