module.exports = {
	prefix: 'tw-',
	important: true,
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
		"../../packages/pf-kit/**/*.{vue,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
			colors: {
				'black': 'rgb(0,0,0)',
				'pf-brand': '#ffc802',
				'pf-brand-dark': '#f8b703',
				'pf-pop': '#0ba59e',
				'pf-pop-dark': '#2e4241',
				'pf-off-black': '#403200'
			},
      fontFamily: {
        source: [ 'Source Sans Pro', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif' ],
        bira: [ 'bira', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif' ]
      },
			rotate: {
				'-4': '-4deg'
			},
		},
  },
  plugins: [],
}