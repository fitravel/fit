<script setup lang="ts">
import { Page } from "../@"
import { UserForm } from "../@"
</script>

<template>
	<Page secure centered>
		<UserForm :id="+$route.params.id" label="Breyta notenda" action="Skrá breytingar" show-delete show-roles></UserForm>
	</Page>
</template>