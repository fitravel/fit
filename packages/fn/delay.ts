export function delay (wait = 250) {
	let timeout: ReturnType<typeof setTimeout>|null = null
	return new Promise((resolve) => {
		timeout = setTimeout(() => resolve(timeout), wait)
	})
}

export default delay