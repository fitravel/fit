<script setup lang="ts">
import { useBruce, useRender } from "vui"
import { map, flatten, repeat } from "ramda"
import { format, addDays, startOfDay, endOfDay, isValid } from "date-fns"
import { CalendarIcon, FolderIcon, FolderOpenIcon, ClipboardCopyIcon, TruckIcon, BeakerIcon } from "@heroicons/vue/solid"
import { whenever } from "@vueuse/shared"
import { ref, computed, onMounted, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type BannerSlot, type BannerSource } from "gygax"

type D = Record<string, any>|null

const { data, getSource, fetchStats, isFinished, execute } = useBruce()
const route = useRoute(), router = useRouter()

const source       = ref<BannerSource|null>(null)
const src          = ref<string>('')
const slots        = computed<BannerSlot[]>(() => source.value?.slots ?? [])
const totalSlots   = computed<number>(() => slots.value?.length ?? 0)
const totalBanners = computed<number>(() => flatten(map((i: BannerSlot) => i.banners)(slots.value))?.length ?? 0)

//

function init () {
	if (isFinished.value) {
		source.value = getSource(route.params.slug as string)
		src.value = source.value?.slug ?? ''
	}
}
onMounted(init)
watch(isFinished, init)
watch(src, (x) => {
	router.push(`/${x}`)
	execute()
	init()
})

//

const startDate = ref(format(addDays(new Date(), -1), 'yyyy-MM-dd'))
const endDate   = ref(format(addDays(new Date(), -1), 'yyyy-MM-dd'))

const dates = computed(() => {
	if (isValid(new Date(startDate.value)) && isValid(new Date(endDate.value))) {
		return { from: startOfDay(new Date(startDate.value)), to: endOfDay(new Date(endDate.value)) }
	}
	return { from: new Date(), to: new Date() }
})
const query = computed(() => [
	{ source: src.value, ...dates.value },
	...map((i: D) => ({ source: src.value, slot: `${i?.width}x${i?.height}${i?.slug ? `-${i?.slug}` : ''}`, ...dates.value }))(slots.value)
])
const { isReady, stats, execute: checkStats } = fetchStats(query)

function fetchDates () {
	init()
	checkStats()
}
whenever(isFinished, fetchDates)

//

const slotURL = (slot: BannerSlot) => {
	const dimensions = `${slot.width}x${slot.height}`
	const slug = slot.slug ? `-${slot.slug}` : ''
	return `https://bruce.one/${source.value?.slug ?? ''}/${dimensions}${slug}/`
}
const isCopyOpen = ref(false)
const isSlotsOpen = ref<boolean[]>([])

function onExpandAll () {
	isSlotsOpen.value = repeat(true)(totalSlots.value)
}
function onCloseAll () {
	isSlotsOpen.value = repeat(false)(totalSlots.value)
}

watch(totalSlots, () => onCloseAll)


//

const isRenderOpen = ref(false)
const { start: onRender } = useRender({ 
	target: 'bruce',
	beforeRender: () => isRenderOpen.value = true,
	afterRender: () => location.reload()
})
</script>

<template>
<Page class="w-screen">
	<template #header>
		<div class="flex gap-4 h-22 overflow-hidden w-full">
			<Logo/>
			<div class="grid content-center">
				<h2>
					<span>Source:</span>
					<select v-model="src" class="border-stone-700 p-2 border-b-2 cursor-pointer">
						<option v-for="source of data" :value="source.slug">
							{{ source.title }}
						</option>
					</select>
				</h2>
			</div>
			<div class="grid content-center grow text-stone-500">
				<span>{{ totalSlots }} slots with {{ totalBanners }} live banners</span>
			</div>
			
			<StatPanel class="h-22" v-bind="{ impressions: stats?.[0]?.impressions, clicks: stats?.[0]?.clicks, isReady }"/>

			<div class="h-22 text-sm px-12">
				<div class="flex h-full">
					<CalendarIcon class="w-6 mr-1"/> 
					<div class="grid content-center text-stone-500 text-center pl-1">
						<small>Last modified:</small>
						<span>{{ format(new Date(source?.modified ?? new Date()), 'dd.MM.yyyy') }}</span>
					</div>
				</div>
			</div>
		</div>
	</template>

	<section class="ctrl px-6 py-4 flex gap-2">
		<CtrlButton text="Expand All" @click="onExpandAll">
			<FolderOpenIcon/>
		</CtrlButton>
		<CtrlButton text="Close All" @click="onCloseAll">
			<FolderIcon/>
		</CtrlButton>

		<CtrlButton text="Copy Links" @click="isCopyOpen = true">
			<ClipboardCopyIcon/>
		</CtrlButton>

		<CtrlButton text="Render Bruce" @click="onRender">
			<TruckIcon/>
		</CtrlButton>

		<div class="flex gap-2 ml-auto">
			<label for="start-date">
				<span class="mr-2">Frá:</span> 
				<input name="start-date" v-model="startDate"/>
			</label>
			<label for="end-date">
				<span class="mr-2">Til:</span>
				<input name="end-date" v-model="endDate"/>
			</label>
			
			<button @click="fetchDates" class="flex text-xs">
				<span class="underline">
					Fetch
				</span> 
				<BeakerIcon class="w-8"/> 
			</button>
		</div>
	</section>

	<section class="px-6 w-full">
		<BannerSlot v-for="({ width, height, slug, banners, fallback }, x) of slots" 
			@update:modelValue="(b: boolean) => isSlotsOpen[x] = b"
			v-bind="{ 
				width, height, slug, 
				banners, fallback,
				source: source?.slug ?? '', 
				impressions: stats?.[x+1]?.impressions ?? {}, 
				clicks: stats?.[x+1]?.clicks ?? {}, 
				modelValue: isSlotsOpen[x] 
		}"/>
	</section>

	<RenderModal v-model="isRenderOpen"/>
	<CopyModal v-model="isCopyOpen" :urls="map(slotURL)(slots)"/>
</Page>
</template>

<style scoped>
header p {
	@apply pt-2;
}
.ctrl button span {
	@apply text-2xl;
}
</style>
