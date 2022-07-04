<script setup lang="ts">
import { useAuth } from "heimdall"
import { PageHeaderTab } from "./"
import { TagIcon, UsersIcon } from "vui/@"
import { startsWith, anyPass, equals } from "ramda"

const auth = useAuth()

</script>

<template>
	<div class="flex gap-8">
		<PageHeaderTab to="/dash" label="Markaðstorg" v-if="auth.isLoggedIn"
			:active="() => anyPass([ equals('/dash'), startsWith('/schedule'), startsWith('/product') ])($route.path)"
		>
			<TagIcon/>
		</PageHeaderTab>

		<PageHeaderTab to="/users" label="Aðgangar" v-if="auth.isAdmin"
			:active="() => startsWith('/user')($route.path)"
		>
			<UsersIcon/>
		</PageHeaderTab>
	</div>
</template>