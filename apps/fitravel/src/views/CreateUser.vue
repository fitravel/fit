<script setup lang="ts">
import { Page, UserForm } from "../@"
import { UserAddIcon } from "vui/@"
</script>

<template>
	<Page secure centered>
		<UserForm label="Stofna nýjan aðgang" action="Stofna aðgang" show-roles>
			<template #icon><UserAddIcon/></template>
			
		</UserForm>
	</Page>
</template>