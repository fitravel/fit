import { initState } from './initState'

export interface Owner {
	id: number;
	slug: string;
	name: string;
	token: string;
	parent: number;
	confirmationPrice: number;
	type: number;
}

const model = ({ id, slug, name, description, parent, acf }: Record<any, any>): Owner => ({ 
	id, slug, name, parent,
	token: description,
	confirmationPrice: +acf.confirmationPrice,
	type: +acf.type
})

export const useOwners = initState<Owner>('owners', model)