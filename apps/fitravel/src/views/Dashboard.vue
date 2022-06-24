<script setup lang="ts">
import { Page } from "vui/@/fitravel"
import { DataTable } from "vui/@"
</script>

<template>
	<Page secure admin>
		<h2>Markaðstorg</h2>
		<DataTable 
			:cols="[
				{ header: 'Dags.', key: 'date' },
				{ header: 'Áfangastaður', key: 'destination' },
				{ header: 'Sæti í boði', key: 'seats' },
				{ header: 'Ath', key: 'comment' }
			]"
			:rows="[
				{ destination: 'AGP', seats: 20, date: '04-08-22', comment: 'Trallala' },
				{ destination: 'TFS', seats: 6, date: '04-08-22', comment: 'Rýmingarsala!' },
				{ destination: 'PMI', seats: 4, date: '04-08-22', comment: 'Millilent kannski' },
			]"
		>
		</DataTable>
	</Page>
</template>