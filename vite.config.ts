import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	base: '/',
	plugins: [tailwindcss()],
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				games: './games.html',
				portfolio: './portfolio.html',
				flikhost: "./flikhost.html",
				notfound: "./404.html"
			}
		}
	}
});
