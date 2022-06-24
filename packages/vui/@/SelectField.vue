<script setup lang="ts">
import { useVModel } from "@vueuse/core"
import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions, 
	FieldChevron, ChevronDoubleDownIcon, ChevronDoubleUpIcon, 
	vScroll } from "vui/@"
import { find } from "geri"
import { computed, ref } from "vue"

export interface SelectOption {
	text: string;
	value: any;
	disabled?: boolean;
}

const props = defineProps<{
	modelValue: any;
	items: SelectOption[];
	label?: string;
	multiple?: boolean;
}>()

const model     = useVModel(props, 'modelValue')
const modelText = computed(() => find<SelectOption>(i => model.value === i.value)(props?.items ?? [])?.text ?? '—')

//

const dropdown = ref<HTMLElement|null>(null)
const atTop    = ref<boolean>(true)
const atBottom = ref<boolean>(false)

// const onScroll = ({ y }: UseScrollReturn) => {
// 	// console.log(y.value)//dropdown.value?.clientHeight)
// 	atTop.value    = (y.value - 5) < 5
// 	atBottom.value = y.value >= y.value + (dropdown.value?.clientHeight ?? 0)
// }
</script>

<template>
	<Listbox v-model="model" #="{ open }" :multiple="multiple">
		<label class="field field--select">
			<ListboxLabel as="div" class="label" v-if="label">
				{{ label }}
			</ListboxLabel>

			<div class="relative">
				<ListboxButton class="input">
					<span class="pl-4">
						{{ modelText }}
					</span>
					<FieldChevron :open="open" @nulled="model = null"/>
				</ListboxButton>

				<Transition
					enter-active-class="transition duration-100 ease-out"
					enter-from-class="transform opacity-0"
					enter-to-class="transform opacity-100"
					leave-active-class="transition duration-75 ease-out"
					leave-from-class="transform opacity-100"
					leave-to-class="transform opacity-0"
				>
					<ListboxOptions class="dropdown">
						<div ref="dropdown">
							<!-- <Transition
								enter-active-class="transition duration-500 ease-out"
								enter-from-class="transform scale-80 opacity-0"
								enter-to-class="transform scale-100 opacity-100"
								leave-active-class="transition duration-500 ease-out"
								leave-from-class="transform scale-100 opacity-100"
								leave-to-class="transform scale-80 opacity-0"
							>
								<div v-if="items.length > 3 && !atTop" class="z-40 absolute top-20 -mt-3 right-6 text-right">
									<ChevronDoubleUpIcon class="h-4 w-4 animate-pulse text-neutral-600"/>
								</div>
							</Transition> -->

							<div>
								<ListboxOption key="_" :value="model">
									<div class="option value">
										<span>{{ modelText }}</span>
									</div>
								</ListboxOption>
								
								<div class="options">
									<ListboxOption v-for="option of items" #="{ active }" v-bind="option" :key="option.value">
										<div class="option" :class="{ active }">
											<span>{{ option.text }}</span>
										</div>
									</ListboxOption>
								</div>
							</div>

							<!-- <Transition
								enter-active-class="transition duration-500 ease-out"
								enter-from-class="transform scale-80 opacity-0"
								enter-to-class="transform scale-100 opacity-100"
								leave-active-class="transition duration-500 ease-out"
								leave-from-class="transform scale-100 opacity-100"
								leave-to-class="transform scale-80 opacity-0"
							>
								<div v-if="items.length > 3 && !atBottom" class="z-40 absolute bottom-6 right-6 text-right">
									<ChevronDoubleDownIcon class="h-4 w-4 animate-pulse text-neutral-600"/>
								</div>
							</Transition> -->
						</div>
					</ListboxOptions>
				</Transition>
			</div>
		</label>
	</Listbox>
</template>