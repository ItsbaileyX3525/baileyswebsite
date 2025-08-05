const portfolioButton: HTMLElement | null = document.getElementById('portfolio-button');


document.addEventListener("DOMContentLoaded", () => {
  if (portfolioButton){
    portfolioButton.addEventListener('click', () => {
      window.location.href = "/portfolio"
    })
  }
})