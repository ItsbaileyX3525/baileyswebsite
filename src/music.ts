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

let songs: [string, number][] = [
    ["DanTDM - Spacedog", .6],
    ["Evlis Presley - Wonder of you", .09],
    ["Idk Who - promise<conversion>", .2],
    ["Goth Babe - Weekend Friend", .2],
    ["SEKAI NO OWARI - The Peak", .1]
]

let songIndex: number = 0
let songName: string
let maxSongs: number
let songPlaying: boolean = false;
let isShuffled: boolean = Boolean(localStorage.getItem("isShuffled")) || true

export function reloadReferences(): void{
    if (!song?.paused) {
        //Song autoplayed
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

                    musicDetails.innerText = songName
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

document.addEventListener("DOMContentLoaded", () => {
    if (song && songSource){
        maxSongs = songs.length - 1

        songName = "Now playing: " + songs[songIndex][0]
        songSource.src = "/assets/" + songs[songIndex][0] + ".mp3"
        song.load()
        song.volume = songs[songIndex][1]

        song.addEventListener('ended', () => {
            if (!isShuffled){
                songIndex ++
                if (songIndex > maxSongs){
                    songIndex = 0
                }
            }else{
                songIndex = Math.floor(Math.random() * (maxSongs - 0 + 1)) + 0;
                console.log(songIndex)
            }
            songName = songs[songIndex][0]
            songSource.src = "/assets/" + songs[songIndex][0] + ".mp3"
            
            if (musicDetails){
                song.load()
                song.volume = songs[songIndex][1]
                song.play();

                clearTimeout(fade1)
                clearTimeout(fade2)

                musicDetails.innerText = songName
                musicDetails.classList.add("opacity-100")

                fade3 = setTimeout(() => {
                    musicDetails?.classList.remove("opacity-100")
                }, 2800)
            }
        })
        if (shuffleImage) {
            if (isShuffled) {
                shuffleImage.src = "/assets/shuffle.svg"
                localStorage.setItem("isShuffled", "true")
            }else {
                shuffleImage.src = "/assets/unshuffled.svg"
                localStorage.setItem("isShuffled", "false")
            }
        }
    }
})

reloadReferences()
