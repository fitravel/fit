<script setup lang="ts">
import { Page as BasePage, LockClosedIcon, Anchor, AtSymbolIcon } from "vui/@"
</script>

<template>
	<BasePage class="w-full max-w-[1600px] mx-auto">
		<template #header>
			<div class="flex p-8 gap-2">
				<Anchor to="/" class="border-b-[3px] pb-4 grow-0 shrink-0 pl-1 border-[#014387] w-80">
					<img src="fi-logo.jpg" class="h-24">
				</Anchor>
				<nav class="w-full border-b-[3px] pb-4 pr-1 border-[#d61a21] relative">
					<div class="absolute bottom-4 right-48">
						<Anchor to="/contact" class="flex text-gray-500">
							<AtSymbolIcon class="w-6"/>
							<span>
								Senda fyrirspurn
							</span>
						</Anchor>
					</div>
					<div class="shadow absolute right-1 bottom-4 rounded-3xl overflow-hidden border-b border-gray-300">
						<button class="flex shadow-inner hover:bg-gray-300 pl-5 bg-gray-200 pr-6 py-2 text-gray-500" @click="$router.push('/login')">
							<LockClosedIcon class="h-6 text-gray-500"/>
							<span class="pl-1 pt-0.5">
								Markaðstorg
							</span>
						</button>
					</div>
				</nav>
			</div>
		</template>

		<template #default>
			<section class="min-h-screen -mt-72 p-8 pt-72 grid items-center">
				<slot />
			</section>
		</template>

		<template #footer>
			<div class="flex p-8 pb-0 gap-2">
				<div class="border-t-[3px] pt-4 grow-0 shrink-0 pl-1 border-[#014387] w-80"></div>
				<div class="w-full border-t-[3px] pb-3 pl-12 pr-1 border-[#d61a21]"></div>
			</div>
			<div class="text-center text-gray-500 px-8 pb-8">
				Ferðaskrifstofa Íslands ehf. · Hlíðasmára 19 · 201 Kópavogur · heildsala@fitravel.is · s. +354 585 4000
			</div>
		</template>
	</BasePage>
</template>