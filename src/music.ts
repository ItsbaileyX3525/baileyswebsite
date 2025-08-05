const musicPlayer: HTMLElement | null = document.getElementById('music-player');
const musicImage = document.getElementById('music-image') as HTMLImageElement | null;
const song = document.getElementById('song') as HTMLAudioElement | null
let songPlaying: boolean = false;


document.addEventListener("DOMContentLoaded", () => {
    if (musicImage && musicPlayer && song){
        if (!song.paused){
            //Song autoplayed
            songPlaying = true;
            musicImage.src = "/assets/speaker_enabled.svg";
        }
        
        musicPlayer.addEventListener("click", () => {
            if (songPlaying) {
                musicImage.src = "/assets/speaker_disabled.svg";
                song.pause()
            }else{
                musicImage.src = "/assets/speaker_enabled.svg";
                song.play()
            }
            songPlaying = !songPlaying;
        })
    }
})