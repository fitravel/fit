<script setup lang="ts">
import { ref } from "vue";
import { TextField, PencilIcon, Heading } from "vui/@"
import ActionButton from "vui/@/ActionButton.vue";

defineProps<{
	label: string
}>()

const title = ref('')
const destination = ref('')
const available = ref('')
const sold = ref('')
const comment = ref('')
const outbound = ref('')
const inbound = ref('')
</script>

<template>
	<form id="product" class="w-full max-w-[72rem] mx-auto">
		<Heading>
			{{ label }}

			<!-- <template #icon>
				<PencilIcon></PencilIcon>
			</template> -->
		</Heading>

		<div class="grid grid-cols-2 gap-8">
			<div>
				<TextField v-model="title" label="Titill"></TextField>
				<TextField v-model="destination" label="Áfangastaður"></TextField>
				
				<div class="grid grid-cols-2 gap-8">
					<TextField v-model="available" label="Sæti í boði" type="number"></TextField>
					<TextField v-model="sold" label="Sæti seld" type="number"></TextField>
				</div>

				<TextField v-model="comment" large label="Athugasemdir" class="min-h-[8rem]"></TextField>
			</div>
			
			<div>
				<TextField v-model="outbound" large label="Flug út" class="min-h-[11.5rem]"></TextField>
				<TextField v-model="inbound" large label="Flug heim" class="min-h-[11.5rem]"></TextField>
			</div>
		</div>

		<ActionButton class="mt-8">
			Skrá tilboð
		</ActionButton>
	</form>
</template>