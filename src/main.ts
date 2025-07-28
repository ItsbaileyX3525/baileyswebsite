let darkMode: boolean = false;

const darkModeToggle: HTMLElement | null = document.getElementById('dark-mode-toggle');
const homeButton: HTMLElement | null = document.getElementById('home-button');
const gamesButton: HTMLElement | null = document.getElementById('games-button');
const portfolioButton: HTMLElement | null = document.getElementById('portfolio-button');

const adventureImage = document.getElementById("adventure-image") as HTMLImageElement | null;

const previousAdventureButton: HTMLElement | null = document.getElementById('prev-adventure-button');
const nextAdventureButton: HTMLElement | null = document.getElementById('next-adventure-button');
const AdventureFooter: HTMLElement | null = document.getElementById("adventure-footer")

let on_current_adventure: number = 0
let adventure_images: string[] = [
  "assets/baileyAdventure/Bailey at the pier.jpg",
  "assets/baileyAdventure/Bailey at the port.jpeg",
  "assets/baileyAdventure/Bailey touching grass.jpg",
  "assets/baileyAdventure/Bailey at auchwitz.jpeg",
  "assets/baileyAdventure/Bailey at the saltmines.jpeg"
]

let adventure_footer: string[] = [
  "Bailey outside (shock) walking down the pier at the local beach",
  "Yet another image of Bailey but this time he walked a buttload to see a city view.",
  "Here I am walking with my mates, just played muffin time and we had to take a picture!",
  "In this I'm at auchwitz... I did not mean to smile. But yea it was awesome learning.",
  "An image of a king in the krakow saltmines... I have no idea what it means."
]

function toggleDarkMode() {
  darkMode = !darkMode;
  alert("haha, dark mode doesn't exist because dark mode is default")
}

darkModeToggle?.addEventListener('click', toggleDarkMode);

//Screw dom loaded

homeButton?.addEventListener('click', () => {
  window.location.href = "/"
})

gamesButton?.addEventListener('click', () => {
  window.location.href = "/games" //Unsure if github will let me strip them htmls, htaccess should work
})

portfolioButton?.addEventListener('click', () => {
  window.location.href = "/portfolio"
})

previousAdventureButton?.addEventListener('click', () => {
  on_current_adventure--
  if (on_current_adventure === -1){
    on_current_adventure = adventure_images.length - 1
  }
  if (adventureImage) {
    adventureImage.src = adventure_images[on_current_adventure]
  }
  if(AdventureFooter){
    AdventureFooter.innerText = adventure_footer[on_current_adventure]
  }
})

nextAdventureButton?.addEventListener('click', () => {
  on_current_adventure++
  if (on_current_adventure >= adventure_images.length){
    on_current_adventure = 0
  }
  if (adventureImage) {
    adventureImage.src = adventure_images[on_current_adventure]
  }
  if(AdventureFooter){
    AdventureFooter.innerText = adventure_footer[on_current_adventure]
  }
})