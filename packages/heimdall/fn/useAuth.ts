import { type MaybeRef } from "@vueuse/core"
import { delay, type R } from "geri"
import { defineStore } from "pinia"
import { isNil } from "ramda"
import { computed, ref, watch } from "vue"
import { fetchEndpoint } from "./fetchEndpoint"

export const useAuth = defineStore('heimdall-auth', () => {
	const user    = ref<R>({})
	const token   = ref<string>('')
	const isError = ref<any>(false)

	const isLoggedIn = computed(() => !isNil(user.value?.id))
	const isAdmin    = computed(() => user.value?.role === 'admin')
	const isReady    = computed(() => isLoggedIn.value || !!isError.value)

	const onError = (error: any) => { 
		console.log(error)
		isError.value = error
		logout()
	}
	const logout = (fn?: () => void) => {
		user.value = {}
		if (!isNil(fn)) fn()
	}
	const login = async (email: MaybeRef<string>, password: MaybeRef<string>) => {
		user.value = await fetchEndpoint('POST', {}, { email, password }).catch(onError)
		return refresh()
	}
	const refresh = async () => {
		const { token: authToken = '' } = await fetchEndpoint('POST', {}, {}, user.value?.token ?? '')
		token.value = authToken
	}
	const waitAndRefresh = async () => { await delay(55000); refresh() }

	watch(token, waitAndRefresh)

	return { login, logout, refresh, user, token, isLoggedIn, isAdmin, isReady }
}, {
	persist: {
		storage: window.localStorage,
		afterRestore ({ store }) {
			store.refresh()
		}
	}
})

export default useAuth