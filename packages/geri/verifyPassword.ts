import { test } from "ramda"

export const verifyPassword = (password: string) => {
	if (password.length <= 7) throw 'Lykilorðið verður að vera a.m.k. 8 stafir'
	if (!test(/[A-Z]/)(password)) throw 'Lykilorðið verður að hafa a.m.k. einn hástaf'
	if (!test(/[a-z]/)(password)) throw 'Lykilorðið verður að hafa a.m.k. einn lágstaf'
	if (!test(/[0-9]/)(password)) throw 'Lykilorðið verður að hafa a.m.k. eina tölu'
	if (!test(/[^a-zA-Z0-9]/)(password)) throw 'Lykilorðið verður að hafa a.m.k. staf sem er ekki bókstafur eða tala'

	return true
}

export default verifyPassword