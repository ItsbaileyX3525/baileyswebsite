const homeButton: HTMLElement | null = document.getElementById('home-button');
const gamesButton: HTMLElement | null = document.getElementById('games-button');
const portfolioButton: HTMLElement | null = document.getElementById('portfolio-button');
const flikhostButton: HTMLElement | null = document.getElementById('flikhost-button');

document.addEventListener("DOMContentLoaded", () => {
  if (homeButton && gamesButton && portfolioButton && flikhostButton){
    homeButton.addEventListener('click', () => {
      window.location.href = "/"
    })

    gamesButton.addEventListener('click', () => {
      window.location.href = "/games" //Unsure if github will let me strip them htmls, htaccess should work <-- Strips automatically no need for .htaccess
      //Only issue is vite doesnt strip so its like heckin weird to deal with on prod vs live
    })

    portfolioButton.addEventListener('click', () => {
      window.location.href = "/portfolio"
    })


    flikhostButton.addEventListener('click', () => {
      window.location.href = "/flikhost"
    })
  }
})