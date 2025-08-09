const musicPlayer: HTMLElement | null = document.getElementById('music-player');
const shuffleButton: HTMLElement | null = document.getElementById('music-player-shuffle');
const musicImage = document.getElementById('music-image') as HTMLImageElement | null;
const musicDetails: HTMLElement | null = document.getElementById('music-details')
const shuffleImage = document.getElementById('shuffle-image') as HTMLImageElement | null;
const song = document.getElementById('song') as HTMLAudioElement | null;
const songSource = document.getElementById("song-source") as HTMLSourceElement | null;
let fade1: ReturnType<typeof setTimeout>;
let fade2: ReturnType<typeof setTimeout>;
let fade3: ReturnType<typeof setTimeout>;

const DB_NAME = 'musicDB';
const DB_VERSION = 1;
const STORE_NAME = 'songs';
let db: IDBDatabase;

const defaultSongs: [string, number][] = [
	["DanTDM - Spacedog", 0.6],
	["Evlis Presley - Wonder of you", 0.09],
	["idk who - promise<conversion>", 0.2],
	["SEKAI NO OWARI - The Peak", 0.1]
];
let songIndex: number = 0
let songName: string = ""
let songPlaying: boolean = false;
let isShuffled: boolean = Boolean(localStorage.getItem("isShuffled")) || true

const indexedDBSongs = new Map<string, string>();
let songs: [string, number][] = [];
let maxSongs: number = 0;

async function appendIndexedDBSongs() {
	const dbSongs = await getAllSongs();
	
	for (const url of indexedDBSongs.values()) {
		URL.revokeObjectURL(url);
	}
	indexedDBSongs.clear();
	
	songs = [];
	for (const song of dbSongs) {
		const url = URL.createObjectURL(song.blob);
		indexedDBSongs.set(song.name, url);
		const defaultVol = defaultSongs.find(([n]) => n === song.name)?.[1] ?? 0.1;
		songs.push([song.name, defaultVol]);
	}
	maxSongs = songs.length - 1;
}

export function reloadReferences(): void{
    if (!song?.paused) {
        songPlaying = true;
        if (musicImage) {
            musicImage.src = "/assets/speaker_enabled.svg";
        }
    }

    if (shuffleButton && shuffleImage){
        shuffleButton.addEventListener('click', () => {
            isShuffled = !isShuffled

            if (isShuffled) {
                shuffleImage.src = "/assets/shuffle.svg"
                localStorage.setItem("isShuffled", "true")
            } else {
                shuffleImage.src = "/assets/unshuffled.svg"
                localStorage.setItem("isShuffled", "false")
            }
        })

    }
    if (musicPlayer) {
        musicPlayer.addEventListener("click", () => {
            if (songs.length === 0) {
                if (musicDetails) {
                    musicDetails.innerText = "No songs available";
                    musicDetails.classList.add("opacity-100");
                    setTimeout(() => {
                        musicDetails?.classList.remove("opacity-100");
                    }, 2800);
                }
                return;
            }

            if (!songName && songs.length > 0) {
                loadSong(0);
                return;
            }

            if (songPlaying) {
                if (musicImage) {
                    musicImage.src = "/assets/speaker_disabled.svg";
                }

                if (song && musicDetails) {
                    song.pause();

                    clearTimeout(fade2)
                    clearTimeout(fade3)

                    musicDetails.innerText = "Now playing: Nothing"
                    musicDetails.classList.add("opacity-100")

                    fade1 = setTimeout(() => {
                        musicDetails?.classList.remove("opacity-100")
                    }, 2800)
                }
            } else {
                if (musicImage) {
                    musicImage.src = "/assets/speaker_enabled.svg";
                }

                if (song && musicDetails) {
                    song.play();

                    clearTimeout(fade1)
                    clearTimeout(fade3)

                    musicDetails.innerText = `Now playing: ${songName}`
                    musicDetails.classList.add("opacity-100")

                    fade2 = setTimeout(() => {
                        musicDetails?.classList.remove("opacity-100")
                    }, 2800)
                }
            }
            songPlaying = !songPlaying;
        });
    }

}

function loadSong(index: number) {
	if (!song || !songSource ){return}
	if (songs.length === 0) {
		console.warn("No songs available to play.");
		song.pause();
		songSource.removeAttribute("src");
		songName = "";
		if (musicDetails) musicDetails.innerText = "No songs available";
		return;
	}

	if (index < 0 || index >= songs.length) {
		console.warn(`Invalid song index: ${index}`);
		return;
	}

	songIndex = index;
	const [name, volume] = songs[songIndex];
	songName = name;

	const blobUrl = indexedDBSongs.get(name);
	if (!blobUrl) {
		console.error(`Song not found in IndexedDB: ${name}`);
		return;
	}

	songSource.src = blobUrl;
	song.load();
	song.volume = volume;

	if (musicDetails) {
		song.play();
		songPlaying = true;
		if (musicImage) {
			musicImage.src = "/assets/speaker_enabled.svg";
		}
		
		clearTimeout(fade1);
		clearTimeout(fade2);

		musicDetails.innerText = `Now playing: ${songName}`;
		musicDetails.classList.add("opacity-100");

		fade3 = setTimeout(() => {
			musicDetails?.classList.remove("opacity-100");
		}, 2800);
	}
}

document.addEventListener("DOMContentLoaded", async () => {
	if (song && songSource) {
		await openDatabase();
		await appendIndexedDBSongs();

		maxSongs = songs.length - 1;

		if (songs.length > 0 && !songName) {
			const [name, volume] = songs[0];
			songName = name;
			const blobUrl = indexedDBSongs.get(name);
			if (blobUrl && songSource) {
				songSource.src = blobUrl;
				song.load();
				song.volume = volume;
			}
		}

		song.addEventListener('ended', () => {
			if (!isShuffled) {
				songIndex++;
				if (songIndex > maxSongs) songIndex = 0;
			} else {
				songIndex = Math.floor(Math.random() * (maxSongs + 1));
			}
			loadSong(songIndex);
		});

		if (shuffleImage) {
			shuffleImage.src = isShuffled
				? "/assets/shuffle.svg"
				: "/assets/unshuffled.svg";
			localStorage.setItem("isShuffled", String(isShuffled));
		}
	}
});

reloadReferences()

interface SongRecord {
	name: string;
	blob: Blob;
}

async function openDatabase(): Promise<void> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db = (event.target as IDBOpenDBRequest).result;
			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'name' });
			}
		};

		request.onsuccess = async () => {
			db = request.result;

			if (!localStorage.getItem("dbInitialized")) {
				await preloadDefaultSongs();
				localStorage.setItem("dbInitialized", "true");
			}
			resolve();
		};

		request.onerror = () => reject(`Database error: ${request.error}`);
	});
}

function storeFile(name: string, blob: Blob): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readwrite');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.put({ name, blob });

		request.onsuccess = () => resolve();
		request.onerror = () => reject(`Failed to store ${name}`);
	});
}

function getAllSongs(): Promise<SongRecord[]> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([STORE_NAME], 'readonly');
		const store = transaction.objectStore(STORE_NAME);
		const request = store.openCursor();
		const songs: SongRecord[] = [];

		request.onsuccess = (event: Event) => {
			const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
			if (cursor) {
				songs.push(cursor.value as SongRecord);
				cursor.continue();
			} else {
				resolve(songs);
			}
		};

		request.onerror = () => reject("Failed to retrieve songs");
	});
}


async function deleteSong(name: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const transaction = db.transaction(["songs"], 'readwrite');
		const store = transaction.objectStore("songs");
		const request = store.delete(name);

		request.onsuccess = () => {
			if (indexedDBSongs.has(name)) {
				URL.revokeObjectURL(indexedDBSongs.get(name)!);
				indexedDBSongs.delete(name);
			}

			const index = songs.findIndex(([songName]) => songName === name);
			if (index !== -1) {
				const isDeletingCurrentSong = (songName === name);
				
				songs.splice(index, 1);
				maxSongs = songs.length - 1; 

				if (songIndex >= songs.length && songs.length > 0) {
					songIndex = 0;
				} else if (songIndex > index) {
					songIndex--;
				}
				
				if (isDeletingCurrentSong && song) {
					song.pause();
					songPlaying = false;
					if (songSource) {
						songSource.removeAttribute("src");
					}
					song.load();
					songName = "";
					
					if (musicImage) {
						musicImage.src = "/assets/speaker_disabled.svg";
					}
					if (musicDetails) {
						musicDetails.innerText = "Song deleted";
						musicDetails.classList.add("opacity-100");
						setTimeout(() => {
							musicDetails?.classList.remove("opacity-100");
						}, 2800);
					}
					
					if (songs.length > 0) {
						const [newName, volume] = songs[songIndex];
						songName = newName;
						const blobUrl = indexedDBSongs.get(newName);
						if (blobUrl && songSource) {
							songSource.src = blobUrl;
							song.load();
							song.volume = volume;
						}
					}
				}
			}

			resolve();
		};

		request.onerror = () => reject(`Failed to delete song: ${name}`);
	});
}


export async function displaySongList() {
	const dbSongs = await getAllSongs();

	const holder = document.getElementById('song-holder') as HTMLElement | null
	const uploader = document.getElementById('uploader') as HTMLInputElement | null;

	if (!holder || !uploader) {
		return;
	}

	holder.innerHTML = '';

	dbSongs.forEach((song) => {
		const container = document.createElement("div");
		container.className = "flex bg-gray-700 mt-5 py-3 px-3 rounded-2xl justify-center max-w-4/5 max-h-12";

		const nameElem = document.createElement("p");
		nameElem.className = "whitespace-nowrap overflow-hidden text-ellipsis w-[200px]";
		nameElem.textContent = song.name;

		const deleteBtn = document.createElement("button");
		deleteBtn.textContent = "X";
		deleteBtn.className = "text-red-600 cursor-pointer ml-8 translate-y-[1px]";
		deleteBtn.onclick = async () => { 
			await deleteSong(song.name); 
			await appendIndexedDBSongs();
			displaySongList();
		};

		container.appendChild(nameElem);
		container.appendChild(deleteBtn);
		holder.appendChild(container);
	});

	const newUploader = uploader.cloneNode(true) as HTMLInputElement;
	uploader.parentNode?.replaceChild(newUploader, uploader);

	newUploader.addEventListener("change", async () => {
		if (!newUploader.files || newUploader.files.length === 0) return;

		const file = newUploader.files[0];

		const blob: Blob = file;

		const name = file.name.replace(/\.[^/.]+$/, "");

		await storeFile(name, blob);
		await appendIndexedDBSongs();
		displaySongList();
	});
}

async function preloadDefaultSongs(): Promise<void> {
	for (const [name] of defaultSongs) {
		const fileUrl = `/assets/${name}.mp3`;
		const response = await fetch(fileUrl);
		if (!response.ok) {
			console.warn(`Failed to fetch default song: ${name}`);
			continue;
		}
		const blob = await response.blob();
		await storeFile(name, blob);
	}

	if (window.location.pathname == "/music_player") {
		displaySongList()
	}
}
