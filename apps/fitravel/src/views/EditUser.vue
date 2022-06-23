<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { UserForm } from "../@"
</script>

<template>
	<Page secure centered>
		<UserForm label="Breyta notenda" action="Skrá breytingar" show-delete show-roles/>
	</Page>
</template>