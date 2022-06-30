import { verifyEmail, isEmpty } from "geri"
import { ref } from "vue"
import { useAuth } from "./useAuth"

export function useLogin () {
	const auth = useAuth()

	const email    = ref('')
	const password = ref('')
	const error    = ref<any>('')

	const login = async () => {
		try {
			if (isEmpty(email.value) || isEmpty(password.value)) {
				throw 'Það verður að fylla út bæði netfang og lykilorð'
			}
			verifyEmail(email.value)

			await auth.login(email, password)
			error.value = ''
		}
		catch (e) {
			error.value = e
		}
	}

	return { email, password, login, error }
}

export default useLogin