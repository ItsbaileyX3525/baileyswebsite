let darkMode: boolean = false;
let darkModeToggle: HTMLElement | null = document.getElementById('dark-mode-toggle');

function toggleDarkMode() {
  darkMode = !darkMode;
  document.documentElement.classList.toggle('dark', darkMode);
}

darkModeToggle?.addEventListener('click', toggleDarkMode);