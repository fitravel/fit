<template>
	<div id="footer-info">
		<span>Ferðaskrifstofa Íslands ehf.</span>
		<span>Hlíðasmára 19, 201 Kópavogur</span>
		<span>heildsolutengilidur@fitravel.is</span>
		<span>s. +354 585 4000</span>
	</div>
</template>

<style lang="postcss" scoped>
#footer-info {
	@apply text-center text-gray-500 px-8;

	> span {
		@apply inline-block;

		& + span::before {
			content: '•';
			@apply px-1;
		}
	}
}
</style>