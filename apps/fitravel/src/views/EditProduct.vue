<script setup lang="ts">
import { Page } from "../@"
import { ProductForm } from "../@"
</script>

<template>
	<Page secure centered>
		<ProductForm :id="+$route.params.id" label="Sníða nýtt tilboð" action="Skrá breytingar"></ProductForm>
	</Page>
</template>