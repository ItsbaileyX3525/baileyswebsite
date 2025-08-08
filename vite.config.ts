import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function generateVersionFilePlugin() {
	return {
		name: 'version-file-plugin',
		apply: "build" as const,
		closeBundle() {
			const versionMetaPath = path.resolve('version.json'); // persistent file
			const outDir = 'dist';
			const outFile = path.join(outDir, 'version.txt');

			let major = 1, minor = 0, patch = 0;

			if (fs.existsSync(versionMetaPath)) {
				try {
					const saved = JSON.parse(fs.readFileSync(versionMetaPath, 'utf8'));
					[major, minor, patch] = saved.version.split('.').map(Number);
					patch += 1;
				} catch (e) {
					console.error('Failed to parse version.json, using default version.');
				}
			}

			const newVersion = `${major}.${minor}.${patch}`;
			const hash = crypto
				.createHash('sha1')
				.update(Date.now().toString())
				.digest('hex')
				.slice(0, 6);

			const fullVersion = `V${newVersion}-${hash}`;

			if (!fs.existsSync(outDir)) {
				fs.mkdirSync(outDir, { recursive: true });
			}

			fs.writeFileSync(outFile, fullVersion + '\n');

			fs.writeFileSync(versionMetaPath, JSON.stringify({ version: newVersion }, null, 2));

			console.log(`Generated version: ${fullVersion}`);
		},
	};
}

export default defineConfig({
	base: '/',
	plugins: [tailwindcss(),generateVersionFilePlugin()],
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				portfolio: './portfolio.html',
				game: "./game.html",
				home: "./home.html",
				stats: "./stats.html",
				flikhost : "./flikhost.html",
				music_player: "./music_player.html",
				notfound: '/404.html'
			}
		}
	}
});
