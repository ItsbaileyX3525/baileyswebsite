let musicPlayer: HTMLElement | null = document.getElementById('music-player');
let musicImage = document.getElementById('music-image') as HTMLImageElement | null;
let song = document.getElementById('song') as HTMLAudioElement | null
let songPlaying: boolean = false;

export function reloadReferences(): void{
    musicPlayer = document.getElementById('music-player') as HTMLElement | null;
    musicImage = document.getElementById('music-image') as HTMLImageElement | null;
    if (!song?.paused){
        //Song autoplayed
        songPlaying = true;
        if (musicImage) {
            musicImage.src = "/assets/speaker_enabled.svg";
        }
    }
    if (musicPlayer) {
        musicPlayer.addEventListener("click", () => {
            if (songPlaying) {
                if (musicImage) {
                    musicImage.src = "/assets/speaker_disabled.svg";
                }
                if (song) {
                    song.pause();
                }
            } else {
                if (musicImage) {
                    musicImage.src = "/assets/speaker_enabled.svg";
                }
                if (song) {
                    song.play();
                }
            }
            songPlaying = !songPlaying;
        });
    }

}
