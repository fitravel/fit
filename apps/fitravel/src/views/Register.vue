<script setup lang="ts">
import { Page, UserForm } from "../@"
import { UserIcon } from "vui/@"
</script>

<template>
	<Page centered>
		<UserForm show-terms label="Nýskráning" action="Sækja um aðgang">
			<template #icon><UserIcon/></template>
		</UserForm>
	</Page>
</template>