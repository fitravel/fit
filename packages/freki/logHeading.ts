export const logHeading = async (i: string, level: number = 1) => {
	switch (level) {
		case 1: return console.log(`\n===============================\n%\t${i}\n===============================\n`)
		case 2: return console.log(`\n-------------------------------\n%\t${i}\n-------------------------------\n`)
		case 3: return console.log(`\n%\t${i}\n`)
	}
}

export default logHeading