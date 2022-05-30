<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { Listbox, ListboxLabel, ListboxOptions, ListboxOption, CheckIcon } from "vui/@"

interface SelectOption {
	text: string;
	value: any;
	disabled: boolean;
}
const props = defineProps<{
	modelValue: any[];
	label: string;
	items: SelectOption[];
}>()
const model = useVModel(props)

</script>

<template>
	<Listbox multiple v-model="model">
		<div class="field--multi-select">
			<ListboxLabel class="label" v-if="label">
				{{ label }}
			</ListboxLabel>

			<div class="field h-40 grid grid-cols-3 overflow-clip">
				<ListboxOptions multiple static class="col-span-2 h-full relative">
					<div class="options static min-h-full max-h-[10rem] h-full">
						<ListboxOption v-for="option of items" #="{ active }" v-bind="option" :key="option.value">
							<div class="option bg-opacity-30 hover:bg-opacity-40 flex" :class="{ active }">
								<span class="border border-neutral-800 rounded p-1 h-6 w-6 -ml-2 mr-4">
									<CheckIcon/>
								</span>
								<span>{{ option.text }}</span>
							</div>
						</ListboxOption>
					</div>
				</ListboxOptions>

				<div class="border-l border-neutral-800 h-full p-4">
					<span v-for="value of model">
						{{ value }}
					</span>
				</div>
			</div>
		</div>
	</Listbox>
</template>