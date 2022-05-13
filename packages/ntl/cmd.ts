import { exec } from "child_process"

export async function cmd (command: string) {
	return new Promise((resolve, reject) => { exec(command, (error, output) => error ? reject(error) : resolve(output)) }).catch(console.error)
}

export default cmd