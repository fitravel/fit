<script setup lang="ts">
</script>

<template>
	<button class="icon-button">
		<span class="icon">
			<slot/>
		</span>
	</button>
</template>

<style lang="postcss">
.icon-button {
	@apply h-full w-9 grid items-center justify-center; 

	.icon {
		svg {
			@apply h-6 hover:bg-black opacity-60 hover:opacity-80 rounded-full;
		}
	}
}
</style>