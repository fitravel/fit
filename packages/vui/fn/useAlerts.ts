import { ref, computed } from "vue"
import { filter as FILTER, append, update, map, reject } from "ramda"
import { defineStore } from "pinia";
import { addSeconds } from "date-fns";
import { delay } from "geri";

interface Alert {
	message: string
	type: string
	sticky: boolean
	id: number
	isActive: boolean
	stamp: Date
}

export const useAlerts = defineStore('alerts', () => {
	const _items = ref([] as Alert[])
	const active = computed(() => FILTER<Alert>(i => i?.isActive ?? false)(_items.value))

	const dummy   = (): Alert => ({ id: -1, message: 'Það kom upp villa!', type: 'error', sticky: false, isActive: true, stamp: new Date() })
	const filter  = (fn: (i: Alert) => boolean) => computed(() => FILTER<Alert>(fn)(active.value))
	const add     = (i: Partial<Alert>) => _items.value.push({ ...dummy(), ...i, id: _items.value.length })
	const dismiss = (id: number) => _items.value[id] = { ..._items.value?.[id] ?? {}, isActive: false }
	const clear   = () => _items.value = []

	async function loop () {
		const tick = new Date()
		_items.value = reject<Alert>(i => !i.sticky && tick > addSeconds(i.stamp, 6))(_items.value)
		await delay(3000)
		loop()
	}
	loop()

	return { active, filter, add, dismiss, clear, dummy }
})

export default useAlerts