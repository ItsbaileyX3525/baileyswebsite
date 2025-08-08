import { reloadReferencesFlikhost } from "./flikhost";
import { reloadReferencesStats } from "./stats";
import { displaySongList } from "./music"

const routes: Record<string, string> = {
	"/": "home",
	"/game": "game",
	"/flikhost": "flikhost",
	"/stats": "stats",
	"/music_player": "music_player"
};

function load404(): void {
	fetch("/404.html")
		.then((res) => {
			if (!res.ok) throw new Error("404 page not found");
			return res.text();
		})
		.then((html) => {
			const app = document.getElementById("app");
			if (app) app.innerHTML = html;
		})
		.catch((err) => console.error("Failed to load 404:", err));
}

export async function render(path: string): Promise<void> {
	const app = document.getElementById("app");
	if (!app) return;

	const page = routes[path];

	if (!page) {
		load404();
		return;
	}

	try {
		const res = await fetch(`/${page}.html`);
		if (!res.ok) throw new Error("Page not found");
		const html = await res.text();
		app.innerHTML = html;

		switch (page) {
			case "home":
				addButtonClicks();
				break;
			case "flikhost":
				reloadReferencesFlikhost();
				break;
			case "stats":
				reloadReferencesStats();
				break;
			case "music_player":
        displaySongList()
				break;
		}

		checkImage();
	} catch (err) {
		console.error("Error rendering page:", err);
		load404();
	}
}

export function navigate(path: string): void {
	history.pushState({}, "", path);
	render(path);
}

document.addEventListener("DOMContentLoaded", () => {
	const cameFrom = localStorage.getItem("404");

	if (cameFrom) {
		navigate(cameFrom);
		localStorage.removeItem("404");
	} else {
		render(location.pathname);
	}

	window.addEventListener("popstate", () => {
		render(location.pathname);
	});

	document.body.addEventListener("click", (e: Event) => {
		const target = e.target as HTMLElement;
		if (target.matches("div[data-link]")) {
      console.log(e)
			e.preventDefault();
			const href = target.getAttribute("href");
			if (href) navigate(href);
		}
	});
});


let onCurrentLanguage: number = 0
let languageImages: string[] = [
  "Python.png",
  "Lua.png",
  "TypeScript.jpg",
  "CSharp.png",
  "Rust.png"
]

let languageFooterText: string[] = [
  "Python is the very first language that I wrote in, back in 2020 when I started getting serious about coding!",
  "Ok, I lied a little, technically Lua was the first language I wrote code in back in 2017 when i \"Built\" Roblox games.",
  "Hey look! It's TypeScript, the very same lang this website is built using! I've just started learning this lang but it's literally JavaScript which I'm a \"god\" at.",
  "C# is one of those languages I passively use, I don't use it much anymore as it was mainly for unity but now I use, the best game engine, Godot!",
  "Rust... Yes rust. I don't use rust at all other than when I'm bored and want to test my knowledge in rust (It isn't good)"
]

let onCurrentGame: number = 0
let gameImages: string[] = [
  "Sus clicker.png",
  "Blocky.png",
  "ClickyMMO.png",
  "Leland slug.png",

]

let gameFooterText: string[] = [
  "Sus clicker, this game is my pride and joy, I've been making it for years! <a class='text-[#ff8c69]' href='https://itsbaileyx3525.itch.io/sus-clicker-remastered' target='_blank'>Check it out here!</a>",
  "They call me blocky is a simple-ish game I'm making for Summer of making! Hoping to get a 3D printer. <a class='text-[#ff8c69]' href='https://itsbaileyx3525.itch.io/they-call-me-blocky' target='_blank'>Check it out here!</a>",
  "ClickyMMO, I was inspired by 8bitMMO but with this you can draw anything with anyone! <a class='text-[#ff8c69]' href='https://itsbaileyx3525.itch.io/clickymmo' target='_blank'>Check it out here!</a>",
  "Leland and the slug, A silly game that we had to make for college. It is not a good game lol. <a class='text-[#ff8c69]' href='https://itsbaileyx3525.itch.io/leland-and-the-slug' target='_blank'>Check it out here!</a>"
]

let onCurrentAdventure: number = 0
let adventureImages: string[] = [
  "Bailey at the pier.jpg",
  "Bailey at the port.jpeg",
  "Bailey touching grass.jpg",
  "Bailey at auchwitz.jpeg",
  "Bailey at the saltmines.jpeg"
]

let adventureFooterText: string[] = [
  "Bailey outside (shock) walking down the pier at the local beach",
  "Yet another image of Bailey but this time he walked a buttload to see a city view.",
  "Here I am walking with my mates, just played muffin time and we had to take a picture!",
  "In this I'm at auchwitz... I did not mean to smile. But yea it was awesome learning.",
  "An image of a king in the krakow saltmines... I have no idea what it means."
]

function addButtonClicks(): void{
  const adventureImage = document.getElementById("adventure-image") as HTMLImageElement | null;
  const gameImage = document.getElementById("game-image") as HTMLImageElement | null;
  const languageImage = document.getElementById("language-image") as HTMLImageElement | null;
  const updates: HTMLElement | null = document.getElementById('updates')
  const closeUpdates = document.getElementById('close-updates') as HTMLButtonElement | null;

  const previousAdventureButton: HTMLElement | null = document.getElementById('prev-adventure-button');
  const nextAdventureButton: HTMLElement | null = document.getElementById('next-adventure-button');
  const AdventureFooter: HTMLElement | null = document.getElementById("adventure-footer")

  const previousGameButton: HTMLElement | null = document.getElementById('prev-game-button');
  const nextGameButton: HTMLElement | null = document.getElementById('next-game-button');
  const gameFooter: HTMLElement | null = document.getElementById("game-footer")

  const previousLanguageButton: HTMLElement | null = document.getElementById('prev-language-button');
  const nextLanguageButton: HTMLElement | null = document.getElementById('next-language-button');
  const languageFooter: HTMLElement | null = document.getElementById("language-footer")


  if (previousAdventureButton && nextAdventureButton){
    previousAdventureButton.addEventListener('click', () => {
      onCurrentAdventure--
      if (onCurrentAdventure === -1){
        onCurrentAdventure = adventureImages.length - 1
      }
      if (adventureImage) {
        adventureImage.src = "assets/index/baileyAdventure/" + adventureImages[onCurrentAdventure]
      }
      if(AdventureFooter){
        AdventureFooter.innerText = adventureFooterText[onCurrentAdventure]
      }
    })

    nextAdventureButton.addEventListener('click', () => {
      onCurrentAdventure++
      if (onCurrentAdventure >= adventureImages.length){
        onCurrentAdventure = 0
      }
      if (adventureImage) {
        adventureImage.src = "assets/index/baileyAdventure/" + adventureImages[onCurrentAdventure]
      }
      if(AdventureFooter){
        AdventureFooter.innerText = adventureFooterText[onCurrentAdventure]
      }
    })
  }

  if (previousGameButton && nextGameButton){
    previousGameButton.addEventListener('click', () => {
      onCurrentGame--
      if (onCurrentGame === -1){
        onCurrentGame = gameImages.length - 1
      }
      if (gameImage) {
        gameImage.src = "assets/index/baileyGames/" + gameImages[onCurrentGame]
      }
      if(gameFooter){
        gameFooter.innerHTML = "<p>" + gameFooterText[onCurrentGame] + "</p>"
      }
    })

    nextGameButton.addEventListener('click', () => {
      onCurrentGame++
      if (onCurrentGame >= gameImages.length){
        onCurrentGame = 0
      }
      if (gameImage) {
        gameImage.src = "assets/index/baileyGames/" + gameImages[onCurrentGame]
      }
      if(gameFooter){
        gameFooter.innerHTML = "<p>" + gameFooterText[onCurrentGame] + "</p>"
      }
    })
  }

  if (previousLanguageButton && nextLanguageButton){
    previousLanguageButton.addEventListener('click', () => {
      onCurrentLanguage--
      if (onCurrentLanguage === -1){
        onCurrentLanguage = languageImages.length - 1
      }
      if (languageImage) {
        languageImage.src = "assets/index/baileyLanguage/" + languageImages[onCurrentLanguage]
      }
      if(languageFooter){
        languageFooter.innerHTML = "<p>" + languageFooterText[onCurrentLanguage] + "</p>"
      }
    })

    nextLanguageButton.addEventListener('click', () => {
      onCurrentLanguage++
      if (onCurrentLanguage >= languageImages.length){
        onCurrentLanguage = 0
      }
      if (languageImage) {
        languageImage.src = "assets/index/baileyLanguage/" + languageImages[onCurrentLanguage]
      }
      if(languageFooter){
        languageFooter.innerHTML = "<p>" + languageFooterText[onCurrentLanguage] + "</p>"
      }
    })
  }

  if (closeUpdates){
    closeUpdates.addEventListener('click', () => {
      if (updates){
        updates.classList.remove("fixed")
        updates.classList.add("hidden")
        localStorage.setItem("ship1", "false")
      }
    })
  }
  
  if (localStorage.getItem("ship1") == "true"){
    //User comes from the first ship
    if (updates){
      updates.classList.remove("hidden")
      updates.classList.add("fixed")
    }
  }
}

function checkImage(): void{
  for (const e of document.querySelectorAll('img')) {
    e.addEventListener('error', function(event) {
      const target = event.target as HTMLImageElement;
      target.src = 'NoImage.jpg';
      target.onerror = null;
    });

    if (e.complete && e.naturalWidth === 0) {
      e.dispatchEvent(new Event('error'));
    }
  }
}