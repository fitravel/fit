import { ref, computed } from "vue"
import { filter, append, update, map } from "ramda"

interface Alert {
	type: string;
	message: string;
	index: number;
	isDismissed: boolean;
}
const ALERTS = ref<Alert[]>([])

export function useAlerts (scope = '') {
	const isType = (i: Alert) => scope ? i.type === scope : true
	const alerts = computed(() => filter((i: Alert) => isType(i) && !(i?.isDismissed ?? null))(ALERTS.value))
	const alert  = (message: string, type = scope) => {
		const index = ALERTS.value.length
		const alert = { type, message, index, isDismissed: false }
		ALERTS.value = append(alert)(ALERTS.value)
		return alert
	}
	const dismiss = (index: number) => {
		const alert = ALERTS.value?.[index] ?? null
		if (!alert) return null
		alert.isDismissed = true
		ALERTS.value = update(index, alert)(ALERTS.value)
		return alert
	}
	const clear = () => {
		const fn = (i: Alert) => {
			if (isType(i)) i.isDismissed = true
			return i
		}
		ALERTS.value = map(fn)(ALERTS.value)
	}

	return { alerts, alert, dismiss, clear }
}

export default useAlerts