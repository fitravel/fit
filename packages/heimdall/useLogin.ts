import { unrefProps, verifyEmail, isEmpty, type R } from "geri"
import { defineStore } from "pinia"
import { stringify } from "qs"
import { ref } from "vue"

const api = 'http://localhost:9999/.netlify/functions/users'

const credentials = defineStore('heimdall-auth', () => {
	const user = ref({
		id: 0,
		role: 'reseller',
		token: ''
	})
	




	return {}
})

export async function fetchEndpoint (method: string, query: R, payload: any) {
	const search = stringify(unrefProps(query))
	const body   = JSON.stringify(unrefProps(payload))
	return fetch(`${api}?${search}`, { method, body }).then(async response => {
		const body = await response.json()
		if (response.status !== 200) throw body?.error ?? 'Það kom upp villa'
		return body
	})
}

export function useLogin () {
	const email    = ref('')
	const password = ref('')
	const error    = ref('')

	const login = async () => {
		try {
			if (isEmpty(email.value) || isEmpty(password.value)) {
				throw 'Það verður að fylla út bæði netfang og lykilorð'
			}
			verifyEmail(email.value)

			const load = await fetchEndpoint('POST', {}, { email, password })
		}
		catch (e) {
			console.log(e)
			error.value = e
		}
	}

	return { email, password, login, error }
}

export default useLogin